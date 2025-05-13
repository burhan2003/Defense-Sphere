import hashlib, json, base64, os
import sqlite3 as sql

# ==========================
try:
    import core.BlockchainTech as BC
except:
    import BlockchainTech as BC

try:
    import core.crYptographY as crypt
except:
    import crYptographY as crypt
# ===========================

__password = None

def hash_actions(hash:str):
        # open the json file and load the data
        with open(rf'core\blocks\{hash}.json', 'rb') as f:
            data = json.load(f)[str(0)]
        
        global __password
        if __password == None:
            __password = 'random'

        # decrypt the data using the symmetric key
        decrypt_data = eval(BC.sym.decrypt_data(base64.b64decode((data))))
        org_hash, new_hash = decrypt_data['password'], hashlib.sha256(__password.encode()).hexdigest()
        
        if __password == 'random':
            new_hash = org_hash

        # print(decrypt_data)

        # compare the hashes
        if org_hash == new_hash:
            # success
            return (0, decrypt_data['name'], decrypt_data['role'], decrypt_data['username'], decrypt_data['face'])
        # wrong password
        return (1, None, None, None, None)

def login(id:int, password:str) -> int:

    bc = BC.Blockchain()

    global __password
    __password = password

    for row in bc.hashmap:
        if row[0] == id:
            return hash_actions(row[1])

    # user not found
    return (2, None, None, None, None)

def register(name:str, role:str, username:str, password:str, register_face:str):

    bc = BC.Blockchain()

    # check if the user alredy exists or not
    usernames = []
    for hashFile in os.listdir(rf'core\blocks'):
        with open(rf'core\blocks\{hashFile}', 'rb') as f:
            data = json.load(f)[str(0)]
        
        decrypt_data = eval(BC.sym.decrypt_data(base64.b64decode((data))))
        usernames.append(decrypt_data['username'])
    
    if username in usernames:
        return -1

    data = {'name': name, 
            'role': role, 
            'username': username, 
            'password': hashlib.sha256(password.encode()).hexdigest(),
            'face': register_face}
    return bc.create_new_block(data)


def forgot_password(dataType:int, prompt:int|str):

    bc = BC.Blockchain()

    #todo data -> userid
    if dataType == 1:
        prompt = int(prompt)
        for row in bc.hashmap:
            if row[0] == prompt:
                return row
                
        return None

    #todo data -> username
    elif dataType == 2:
        for row in bc.hashmap:
            if row[0]:
                with open(rf'core\blocks\{row[1]}.json', 'r') as f:
                    whole_data = json.load(f)
                    data = whole_data[str(0)]

                decrypt_data = eval(BC.sym.decrypt_data(base64.b64decode((data))))
                if decrypt_data['username'] == prompt:
                    return row
        
        return None

def reset_password(row:list|tuple, newPassword:str):

    bc = BC.Blockchain()

    with open(rf'core\blocks\{row[1]}.json', 'r') as f:
        whole_data = json.load(f)
        data = whole_data[str(0)]
    
    decrypt_data = eval(BC.sym.decrypt_data(base64.b64decode((data))))
    decrypt_data['password'] = hashlib.sha256(newPassword.encode()).hexdigest()

    sym = crypt.Symmetric()
    d = sym.encrypt_data(str(decrypt_data))
    enc_data = base64.b64encode(d).decode()
    h = hashlib.sha256(enc_data.encode()).hexdigest()

    whole_data[str(0)] = enc_data
    whole_data[str(1)] = h

    with open(rf'core\blocks\{h}.json', 'w') as f:
        json.dump(whole_data, f)
    
    con = sql.connect(r'core\hashmap.db', autocommit=True, check_same_thread=False)
    cur = con.cursor()
    cur.execute(f"UPDATE blockchain SET curHash='{h}' WHERE id='{row[0]}'")
    cur.execute(f"DELETE FROM blockchain WHERE curHash='{row[1]}'")
    con.close()

    print('Password has been reset')

    os.remove(rf'core\blocks\{row[1]}.json')


############################################

if __name__ == '__main__':

    c = int(input('\nLogin (1), Register (2) or Forgot Password (3): '))

    if c == 1:
        try:
            id = int(input('[LOGIN] Enter your User ID: '))
        except:
            print('[x] Invalid User ID')
            exit()
        password = input('[LOGIN] Enter your password: ')
        print(login(id, password))

    elif c == 2:
        name = input('[REGISTER] Enter the name: ')
        role = input('[REGISTER] Enter the role: ')
        username = input('[REGISTER] Enter the username: ')
        password = hashlib.sha256(input('[REGISTER] Enter the password: ').encode()).hexdigest()
        register(name, role, username, password)
    
    elif c == 3:
        dataType = int(input('[FORGOT PASSWORD] UserID (1) or Username (2): '))
        prompt = input('[FORGOT PASSWORD] Enter the data: ')

        row = forgot_password(dataType, prompt)
        if row:
            newPassword = input('Enter your New Password: ')
            reset_password(row, newPassword)
