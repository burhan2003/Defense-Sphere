from requests_tor import RequestsTor
import os, psutil, requests

process_name = 'tor.exe'

errorCount = 0
rq = None

def standard_vpn_fetch() -> dict:
        ip = requests.get('http://httpbin.org/ip').json()['origin']
        locData = requests.get(f'http://ip-api.com/json/{ip}').json()
        return {
            'query': ip,
            'country': locData['country'],
            'city': locData['city'],
            'regionName': locData['regionName']
        }

def tor_vpn_fetch() -> dict:
    # obtain the new IP
    url1 = 'http://httpbin.org/ip'
    ip = eval(rq.get(url1).text)['origin']

    # obtain ip information
    url2 = f'http://ip-api.com/json/{ip}'
    d = rq.get(url2).text
    proxy_data = eval(d)

    return proxy_data

def run() -> dict:
    # threading.Thread(target=_work).start()
    os.startfile(r'core\tor.exe')

    # connect to the TOR server
    global errorCount, rq, proxy_data
    while errorCount <= 10:
        try:
            rq = RequestsTor(tor_ports=(9050, ), tor_cport=9051)
            rq.get('https://google.com')
            print('Tor Relay Check Compelete')

            proxy_data = tor_vpn_fetch()

            errorCount = 0

            return proxy_data

        except Exception as e:
            print(f'{e} | Reconnecting...')
            errorCount += 1

def is_process_running() -> bool:
    global proc
    for proc in psutil.process_iter():
        try:
            if process_name.casefold() == proc.name().casefold():
                return True
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass
    return False

def kill() -> None:
    proc.kill()
    DATA = standard_vpn_fetch()
    return DATA

# print(is_process_running())