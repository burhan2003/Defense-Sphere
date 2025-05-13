import sqlite3 as sql
import hashlib
import time
import pyttsx3
import core.Logs as Logs

def _database_and_table_handler():
    global con, cur
    con = sql.connect('core/Integrity.db', autocommit=True, check_same_thread=False)
    cur = con.cursor()

    cur.execute('CREATE TABLE IF NOT EXISTS hashes (file TEXT PRIMARY KEY,hash TEXT,alert BOOL, pause BOOL)')

_database_and_table_handler()

def _fetch_data():
    cur.execute('SELECT * FROM hashes')
    data = cur.fetchall()
    return data

def _hash_file(file:str):
    sha256_hash = hashlib.sha256()

    with open(file, "rb") as f:
        sha256_hash.update(f.read())

    return sha256_hash.hexdigest()

def _check_integrity(file:str, hash:str) -> bool:
    
    try:
        if hash == _hash_file(file):
            return True
        return False
    except Exception as e:
        remove(file)

def add(file:str) -> int:
    try:
        cur.execute(f'INSERT INTO hashes VALUES ("{file}", "{_hash_file(file)}", 0, 0)')
        return 0
    except Exception as e:
        return 1

def remove(file):
    try:
        cur.execute(f'DELETE FROM hashes WHERE file="{file}"')
    except Exception as e:
        pass

def clear(file):
    newHash = _hash_file(file)
    cur.execute(f'UPDATE hashes SET alert=0, hash="{newHash}" WHERE file="{file}"')

def pause(file):
    cur.execute(f'UPDATE hashes SET pause=1 WHERE file="{file}"')

def resume(file):
    cur.execute(f'UPDATE hashes SET pause=0 WHERE file="{file}"')

    newHash = _hash_file(file)
    cur.execute(f'UPDATE hashes SET hash="{newHash}" WHERE file="{file}"')

def voice_alert(s='File Breach Detected! Immediate attention recommended!'):
    engine = pyttsx3.init()
    voices = engine.getProperty('voices')
    engine.setProperty('voice', voices[1].id)
    engine.setProperty('rate', 160)
    engine.say(s)        
    engine.runAndWait()

def run():
    global DATA
    while True:
        DATA, data = dict(), _fetch_data()
        for (file, hash, alert, pause) in data:
            DATA[file] = {'alert':alert, 'pause':pause}
            if (not pause) and (not _check_integrity(file, hash)) and alert==0:
                cur.execute(f'UPDATE hashes SET alert=1 WHERE file="{file}"')
                voice_alert()
                # Logs.write_log(f'File Breach Detected: {file}')
                Logs.write_log("#adminOnly", f'<b>File Breach Detected:</b> {file}')

        time.sleep(2)