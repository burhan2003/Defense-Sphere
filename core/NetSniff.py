import scapy.all as sc
import socket
import requests
import json

def abuse_detection(ip):
    
    # Defining the api-endpoint
    url = 'https://api.abuseipdb.com/api/v2/check'

    querystring = {
        'ipAddress': ip,
        'maxAgeInDays': '90'
    }

    headers = {
        'Accept': 'application/json',
        'Key': '0f8b2812a0e516c8329877936474d09ab16b5fb12fd2a3105facdf4d9d0ff1df930eb964fa4022e7'
    }

    response = requests.request(method='GET', url=url, headers=headers, params=querystring)

    # Formatted output
    decodedResponse = json.loads(response.text)
    print(decodedResponse)
    data = decodedResponse['data']['abuseConfidenceScore']

    return data


errorIPs = set()

def resolve(ip):
    return (socket.gethostbyaddr(ip))[0]

def packet_callback(packet:sc.Packet):

    ip = -1

    global errorIPs
    try:
        if packet.haslayer('TCP'): layer1 = 'TCP'
        elif packet.haslayer('UDP'): layer1 = 'UDP'

        if packet.haslayer('IP'): layer2 = 'IP'
        elif packet.haslayer('IPv6'): layer2 = 'IPv6'

        ip = (packet[layer2].src, packet[layer2].dst) [(packet[layer1].sport, packet[layer1].dport).index(443)]

        if ip not in errorIPs:
            # data = abuse_detection(ip) if socket.gethostbyaddr(ip) else 0
            data = socket.gethostbyaddr(ip)
            print(data+'\n='*50)

    except Exception as e:
        # errorIPs.append(ip) if ip != -1 else None
        errorIPs.add(ip) if ip != -1 else None
        # errorIPs = list(set(errorIPs))

def run():
    sc.sniff(iface=0, prn=packet_callback, store=False)

run()