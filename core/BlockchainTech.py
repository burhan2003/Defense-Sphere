import hashlib
import json
import sqlite3 as sql
import random
import os
import base64
try:
    import core.crYptographY as crypt
except:
    import crYptographY as crypt
    
# DIFFICULTY = 6
DIFFICULTY = 2

sym = crypt.Symmetric()

class Block:
    
    @classmethod
    def __init__(cls, prevHash:str, data:str):

        cls.prevHash = prevHash
        cls.data = data
        cls.hash = cls.__calculate_hash(DIFFICULTY)
    
    @classmethod
    def __calculate_hash(cls, difficulty:int):
        print(f'[Difficulty: {difficulty}] Calculating hash....')
        data = eval(cls.data)
        data['nonce'] = 1
        while True:
            d = sym.encrypt_data(str(data))
            cls.enc_data = base64.b64encode(d).decode()
            h = hashlib.sha256(cls.enc_data.encode()).hexdigest()
            if h[0:difficulty] == '0'*difficulty:
                return h
            data['nonce'] += 1

class Blockchain:

    def __init__(self):
        # create necessory directories
        os.makedirs(r'core\blocks', exist_ok=True)

        # initate SQL connection
        self.conn = sql.connect(r'core\hashmap.db', autocommit=True, check_same_thread=False)
        self.c = self.conn.cursor()
        
        if not self.__check_db_already_existed():
            self.__handle_new_sql_db()
        self.hashmap = self.__load_chain()

        # print(self.hashmap)
    
    # check if the database already existed
    def __check_db_already_existed(self):
        try:
            self.c.execute("SELECT * FROM blockchain LIMIT 1")
            return True
        except:
            return False
    
    # handler table creation, in case of no previous db file found
    def __handle_new_sql_db(self):
        self.c.execute("CREATE TABLE blockchain (id INTEGER PRIMARY KEY, curHash TEXT)")
        self.c.execute(f"INSERT INTO blockchain VALUES (0, '')")

    # load previous saved blockchain data from db file
    def __load_chain(self):
        self.c.execute("SELECT * FROM blockchain")
        return self.c.fetchall()

    # adding id -> hash map to sql
    def __add_hashMap_to_sql(self):
        while True:
            # 9-digit unique code for each user
            __user_id = random.randrange(100000000, 999999999)
            try:
                self.c.execute(f"INSERT INTO blockchain VALUES ({__user_id}, '{Block.hash}')")
                return __user_id
            except Exception as e:
                print(e)
                continue

    def write_json(self):
        with open(rf'core\blocks\{Block.hash}.json', 'w') as f:
            data = {
                -1: Block.prevHash,
                0: Block.enc_data,
                1: Block.hash
            }
            json.dump(data, f)

    # creation of new block while Registeration
    def create_new_block(self, data:dict):
        self.hashmap.append(Block(self.hashmap[-1][-1], str(data)))
        userID = self.__add_hashMap_to_sql()
        self.write_json()
        return userID
        
        
