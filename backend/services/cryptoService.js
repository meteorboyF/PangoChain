const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

class CryptoService {
  constructor() {
    this.keysDirectory = path.join(__dirname, '../keys');
    this.initializeKeysDirectory();
  }

  async initializeKeysDirectory() {
    try {
      await fs.access(this.keysDirectory);
    } catch {
      await fs.mkdir(this.keysDirectory, { recursive: true });
    }
  }

  // Generate RSA key pair for a user
  async generateUserKeyPair(userId) {
    try {
      console.log(`🔐 Generating RSA key pair for user ${userId}...`);
      
      const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem'
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem'
        }
      });

      // Store keys (in production, private keys should be stored securely)
      const publicKeyPath = path.join(this.keysDirectory, `${userId}_public.pem`);
      const privateKeyPath = path.join(this.keysDirectory, `${userId}_private.pem`);
      
      await fs.writeFile(publicKeyPath, publicKey);
      await fs.writeFile(privateKeyPath, privateKey);

      console.log(`✅ RSA keys generated and stored for user ${userId}`);
      
      return {
        publicKey,
        privateKey,
        publicKeyPath,
        privateKeyPath,
        keyId: `rsa-${userId}-${Date.now()}`
      };
    } catch (error) {
      console.error('❌ Key generation failed:', error);
      throw error;
    }
  }

  // Get user's public key
  async getUserPublicKey(userId) {
    try {
      const publicKeyPath = path.join(this.keysDirectory, `${userId}_public.pem`);
      const publicKey = await fs.readFile(publicKeyPath, 'utf8');
      return publicKey;
    } catch (error) {
      console.log(`⚠️  No public key found for user ${userId}, generating new key pair...`);
      const keyPair = await this.generateUserKeyPair(userId);
      return keyPair.publicKey;
    }
  }

  // Get user's private key
  async getUserPrivateKey(userId) {
    try {
      const privateKeyPath = path.join(this.keysDirectory, `${userId}_private.pem`);
      const privateKey = await fs.readFile(privateKeyPath, 'utf8');
      return privateKey;
    } catch (error) {
      throw new Error(`Private key not found for user ${userId}`);
    }
  }

  // Sign data with user's private key
  async signData(data, userId) {
    try {
      // Try to get private key, generate if needed
      let privateKey;
      try {
        privateKey = await this.getUserPrivateKey(userId);
      } catch (error) {
        // If user has no keys, generate them first
        const keyPair = await this.generateUserKeyPair(userId);
        privateKey = keyPair.privateKey;
      }

      const sign = crypto.createSign('RSA-SHA256');
      sign.update(JSON.stringify(data));
      const signature = sign.sign(privateKey, 'base64');
      
      console.log(`🔏 Data signed by user ${userId}`);
      return {
        signature,
        algorithm: 'RSA-SHA256',
        keyId: `rsa-${userId}`,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Digital signing failed:', error);
      throw error;
    }
  }

  // Verify signature with user's public key
  async verifySignature(data, signature, userId) {
    try {
      const publicKey = await this.getUserPublicKey(userId);
      const verify = crypto.createVerify('RSA-SHA256');
      verify.update(JSON.stringify(data));
      
      const isValid = verify.verify(publicKey, signature.signature, 'base64');
      
      console.log(`🔍 Signature verification for user ${userId}: ${isValid ? 'VALID' : 'INVALID'}`);
      return {
        isValid,
        signedBy: userId,
        algorithm: signature.algorithm,
        verifiedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Signature verification failed:', error);
      return { isValid: false, error: error.message };
    }
  }

  // Create document hash with digital signature
  async createSignedDocumentHash(fileBuffer, metadata, userId) {
    const documentData = {
      contentHash: crypto.createHash('sha256').update(fileBuffer).digest('hex'),
      metadata: {
        fileName: metadata.fileName,
        fileSize: metadata.fileSize,
        uploadedAt: metadata.uploadedAt || new Date(),
        uploadedBy: metadata.uploadedBy
      }
    };

    // Sign the document data
    const signature = await this.signData(documentData, userId);
    
    return {
      documentHash: crypto.createHash('sha256')
        .update(JSON.stringify(documentData))
        .digest('hex'),
      signature,
      documentData
    };
  }

  // Verify signed document integrity
  async verifySignedDocument(fileBuffer, originalSignedHash, userId) {
    try {
      const { documentHash, signature, documentData } = originalSignedHash;
      
      // Verify signature
      const signatureVerification = await this.verifySignature(documentData, signature, userId);
      
      // Verify content hasn't changed
      const currentContentHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
      const contentMatch = currentContentHash === documentData.contentHash;
      
      // Verify overall document hash
      const currentDocumentHash = crypto.createHash('sha256')
        .update(JSON.stringify(documentData))
        .digest('hex');
      const hashMatch = currentDocumentHash === documentHash;
      
      return {
        isValid: signatureVerification.isValid && contentMatch && hashMatch,
        signatureValid: signatureVerification.isValid,
        contentIntact: contentMatch,
        hashIntact: hashMatch,
        signedBy: userId,
        verifiedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Document verification failed:', error);
      return { isValid: false, error: error.message };
    }
  }

  // Generate certificate-like information for user
  async generateUserCertificate(userId, userData) {
    try {
      // Try to get user's public key, create a demo one if needed
      let publicKey;
      try {
        publicKey = await this.getUserPublicKey(userId);
      } catch (error) {
        // If user has no keys, generate them first
        const keyPair = await this.generateUserKeyPair(userId);
        publicKey = keyPair.publicKey;
      }
      
      const certificate = {
        subject: {
          commonName: userData.name || 'PangoChain User',
          emailAddress: userData.email || 'user@pangochain.legal',
          organizationUnit: userData.role || 'Legal Professional',
          organization: 'PangoChain Legal System'
        },
        issuer: {
          commonName: 'PangoChain Certificate Authority',
          organization: 'PangoChain'
        },
        publicKey: publicKey,
        serialNumber: crypto.randomBytes(16).toString('hex'),
        validFrom: new Date(),
        validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        keyUsage: ['digitalSignature', 'keyEncipherment', 'nonRepudiation'],
        extendedKeyUsage: ['clientAuth', 'documentSigning']
      };

      // Create a simple certificate hash for integrity
      const certificateHash = crypto.createHash('sha256').update(JSON.stringify(certificate)).digest('hex');
      
      return {
        certificate,
        certificateHash,
        pem: this.certificateToPEM(certificate),
        status: 'generated',
        generatedAt: new Date()
      };
    } catch (error) {
      console.error('❌ Certificate generation failed:', error);
      throw new Error('Failed to generate certificate: ' + error.message);
    }
  }

  // Convert certificate to PEM-like format for display
  certificateToPEM(certificate) {
    const certData = Buffer.from(JSON.stringify(certificate)).toString('base64');
    return `-----BEGIN CERTIFICATE-----\n${certData.match(/.{1,64}/g).join('\n')}\n-----END CERTIFICATE-----`;
  }

  // Encrypt sensitive data (for privacy features)
  encryptData(data, password) {
    const algorithm = 'aes-256-gcm';
    const key = crypto.scryptSync(password, 'salt', 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(algorithm, key);
    
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      algorithm
    };
  }

  // Decrypt sensitive data
  decryptData(encryptedData, password) {
    const algorithm = 'aes-256-gcm';
    const key = crypto.scryptSync(password, 'salt', 32);
    const decipher = crypto.createDecipher(algorithm, key);
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return JSON.parse(decrypted);
  }

  // Create anonymized hash for privacy
  createAnonymousHash(userId, salt = null) {
    const actualSalt = salt || process.env.PRIVACY_SALT || 'pangochain-privacy-salt';
    return crypto
      .createHash('sha256')
      .update(userId + actualSalt)
      .digest('hex')
      .substring(0, 16); // Shortened for display
  }

  // Generate system-wide cryptographic stats for frontend
  async getSystemCryptoStats() {
    try {
      const keyFiles = await fs.readdir(this.keysDirectory);
      const publicKeys = keyFiles.filter(f => f.endsWith('_public.pem'));
      const privateKeys = keyFiles.filter(f => f.endsWith('_private.pem'));
      
      return {
        totalKeyPairs: Math.min(publicKeys.length, privateKeys.length),
        publicKeys: publicKeys.length,
        privateKeys: privateKeys.length,
        cryptoAlgorithm: 'RSA-2048 with SHA-256',
        certificateAuthority: 'PangoChain CA',
        keyStrength: '2048-bit RSA',
        signatureAlgorithm: 'RSA-SHA256',
        encryptionAlgorithm: 'AES-256-GCM'
      };
    } catch (error) {
      return {
        totalKeyPairs: 0,
        error: error.message
      };
    }
  }
}

module.exports = CryptoService;