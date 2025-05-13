import psutil, pyttsx3, time
import core.Logs as Logs

def _voice_alert(n):
    speech = f'{n} Unknown {'device' if n == 1 else 'devices'} detected!'
    engine = pyttsx3.init()
    voices = engine.getProperty('voices')
    engine.setProperty('voice', voices[1].id)
    engine.setProperty('rate', 120)
    engine.say(speech)        
    engine.runAndWait()

def run():
    while True:
        count = 0
        for drive in psutil.disk_partitions():
            if drive.opts.split(',')[1] == 'removable':
                count += 1
        if count:
            _voice_alert(count)
            Logs.write_log('#adminOnly', 'Foreign device detected!')

        time.sleep(2)
        