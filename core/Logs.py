import base64, os
from datetime import datetime
import sqlite3 as sql
try:
    import core.crYptographY as crypt
except:
    import crYptographY as crypt

con = sql.connect('core/logs.db', autocommit=True, check_same_thread=False)
cur = con.cursor()
cur.execute("CREATE TABLE IF NOT EXISTS logs (time DATETIME, log TEXT)")

c = crypt.Asymmetric()

if 'public_key.pem' not in os.listdir('core/keys'):
    private_pem, public_pem = c.generate_keys()
    c.write_keys(private_pem, public_pem)

private_key, public_key = c.load_keys()

def write_log(uname:str|int, action:str):
    log = f'<span title="{uname}"> {action} </span>'
    d = c.encrypt_message(log, public_key)
    data = base64.b64encode(d).decode()

    time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cur.execute(f'INSERT INTO logs VALUES ("{time}", "{data}")')
    # cur.execute(f'INSERT INTO logs VALUES ("{time}", "{d}")')

def read_logs():
    cur.execute('SELECT * FROM logs')
    R = cur.fetchall()

    data = []
    for r in R:
        d = base64.b64decode(r[1])
        log = c.decrypt_message(d, private_key)
        data.append({'timestamp': r[0], 'activity': log})

    return data

if __name__ == "__main__":
    # write_log('hi there')
    # write_log('how are you')
    print(read_logs())