from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import padding as padding_asym
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import padding as padding_sym
from cryptography.hazmat.primitives import hashes
import os, base64

PASSPHRASE = bytes(base64.b64decode(b'UFJPVEVDVElPTl9DT0RFX1hfMTUwNw==').decode(), encoding='UTF-8')

# directory handler
os.makedirs(r'core\keys', exist_ok=True)

class Asymmetric:

    def generate_keys(self):
        # Generate RSA private key
        private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=2048,
            backend=default_backend()
        )

        # Generate RSA public key
        public_key = private_key.public_key()

        # Serialize the private key
        private_pem = private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.BestAvailableEncryption(PASSPHRASE)
        )

        # Serialize the public key
        public_pem = public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        )

        return private_pem, public_pem

    def write_keys(self, private_pem, public_pem):
        # Save the private key to a file
        with open(r'core\keys\private_key.pem', 'wb') as private_file:
            private_file.write(private_pem)

        # Save the public key to a file
        with open(r'core\keys\public_key.pem', 'wb') as public_file:
            public_file.write(public_pem)

    def load_keys(self):
        # Load the private key from a file
        with open(r'core\keys\private_key.pem', 'rb') as private_file:
            private_pem = private_file.read()
            private_key = serialization.load_pem_private_key(
                private_pem,
                password=PASSPHRASE,
                backend=default_backend()
            )

        # Load the public key from a file
        with open(r'core\keys\public_key.pem', 'rb') as public_file:
            public_pem = public_file.read()
            public_key = serialization.load_pem_public_key(
                public_pem,
                backend=default_backend()
            )

        return private_key, public_key

    # using public key
    def encrypt_message(self, msg: str, public_key) -> bytes:
        return public_key.encrypt(
            msg.encode('utf-8'),  # Encode the message to bytes
            padding_asym.OAEP(
                mgf=padding_asym.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        )

    # using private key
    def decrypt_message(self, encrypted_msg: bytes, private_key) -> str:
        return private_key.decrypt(
            encrypted_msg,
            padding_asym.OAEP(
                mgf=padding_asym.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        ).decode('utf-8')  # Decode the decrypted bytes back to string


class Symmetric:

    '''
    Case 01 [Don't have a key file with you]\n
    Case 02 [Have a key file with you]\n\n
    
    For both the cases,\n
    specify the key file path (with key.pem at the end)\n
    while making Symmetric class's instance
    '''

    def __init__(self, filename=r'core\keys\key.pem'):
        # Generate a random key and initialization vector (IV)
        if os.path.exists(filename):
            self.key, self.iv = self.load_key(filename)
        else:
            self.key = os.urandom(32)  # AES-256 requires a 32-byte key
            self.iv = os.urandom(16)   # AES block size is 16 bytes
            self.write_key(filename)
    
    def write_key(self, filename):
        key_b64 = base64.b64encode(self.key).decode('utf-8')
        iv_b64 = base64.b64encode(self.iv).decode('utf-8')
        pem_data = (
        f"-----BEGIN SYMMETRIC KEY-----\n{key_b64}\n-----END SYMMETRIC KEY-----\n"
        f"-----BEGIN IV-----\n{iv_b64}\n-----END IV-----\n")
        with open(filename, 'w') as pem_file:
            pem_file.write(pem_data)

    # Load the symmetric key from a PEM file
    def load_key(self, filename):
        with open(filename, 'r') as pem_file:
            pem_data = pem_file.read()
        key_b64 = pem_data.split("-----BEGIN SYMMETRIC KEY-----\n")[1].split("\n-----END SYMMETRIC KEY-----\n")[0]
        iv_b64 = pem_data.split("-----BEGIN IV-----\n")[1].split("\n-----END IV-----\n")[0]
        key = base64.b64decode(key_b64)
        iv = base64.b64decode(iv_b64)
        return key, iv

    def encrypt_data(self, message:str) -> bytes:
        # Pad the message to be AES block size compliant
        padder = padding_sym.PKCS7(algorithms.AES.block_size).padder()
        padded_message = padder.update(message.encode()) + padder.finalize()

        # Create a Cipher object
        cipher = Cipher(algorithms.AES(self.key), modes.CBC(self.iv), backend=default_backend())
        encryptor = cipher.encryptor()

        # Encrypt the padded message
        encrypted_message = encryptor.update(padded_message) + encryptor.finalize()
        return encrypted_message

    def decrypt_data(self, encrypted_message:bytes) -> str:
        # Create a Cipher object
        cipher = Cipher(algorithms.AES(self.key), modes.CBC(self.iv), backend=default_backend())
        decryptor = cipher.decryptor()

        # Decrypt the message
        decrypted_padded_message = decryptor.update(encrypted_message) + decryptor.finalize()

        # Unpad the decrypted message
        unpadder = padding_sym.PKCS7(algorithms.AES.block_size).unpadder()
        decrypted_message = unpadder.update(decrypted_padded_message) + unpadder.finalize()
        return decrypted_message.decode()

if __name__ == '__main__':
    msg = 'secret message'

    c = Asymmetric()
    private_pem, public_pem = c.generate_keys()
    c.write_keys(private_pem, public_pem)
    private_key, public_key = c.load_keys()

    enc = c.encrypt_message(msg, public_key)
    print("Encrypted:", enc)
    dec = c.decrypt_message(enc, private_key)
    print("Decrypted:", dec)

    c = Symmetric(r'core\keys\key.pem')
    enc = c.encrypt_data(msg)
    print(enc)
    print(c.decrypt_data(enc))