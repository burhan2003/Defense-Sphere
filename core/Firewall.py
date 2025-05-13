import re
import subprocess

def _extract_rules(rules_text):
    rules = re.split(r'(?=Rule Name:)', rules_text)
    extracted_rules = [rule.strip() for rule in rules if rule.strip()]
    return extracted_rules

def _parse_rule(rule_list):
    rule_list_2= []
    for rule in rule_list:
        rule_dictionary = {}
        for key, value in [tuple(attrib2.split(': ')) for attrib2 in [' '.join(attrib.split()) for attrib in rule.split('\r\n')] if len(attrib2.split(': ')) == 2]:
            rule_dictionary[key] = value
        rule_list_2.append(rule_dictionary)
    return rule_list_2

def _filter_icebox_rules(rules:list):
    return [rule for rule in rules if '[ICEBOX]' in rule['Rule Name']]

def show_rules() -> list:
    rules = subprocess.run('netsh advfirewall firewall show rule name=all', capture_output=True, shell=True).stdout.decode()
    parsed_rules = _parse_rule(_extract_rules(rules))
    return _filter_icebox_rules(parsed_rules)

def create_rule(name=None, dir=None, action=None, program=None, service=None, description=None, enable=None, profile=None, localip:str=None, remoteip:str=None, localport=None, remoteport=None, protocol=None, interfacetype=None, rmtcomputergrp=None, rmtusrgrp=None, edge=None, security=None) -> int|str:
    # domain to ip resolution
    attributes = (
        f"name=\"[ICEBOX] {name}\" "
        f"enable={enable} "
        f"dir={dir} "
        f"action={action} "
        f"protocol={protocol} "
        f"program=\"{program}\" "
        f"service=\"{service}\" "
        f"description=\"{description}\" "
        f"localip=\"{localip}\" "
        f"localport=\"{localport}\" "
        f"remoteip=\"{remoteip}\" "
        f"remoteport=\"{remoteport}\" "
    ).replace('""', 'None')
    attributes = ' '.join([attrib for attrib in attributes.split() if 'None' not in attrib])

    response = subprocess.run(f'netsh advfirewall firewall add rule {attributes}', capture_output=True, shell=True).stdout.decode()

    # RULE ADDED SUCCESSFULLY
    if b'Ok.\r\n\r\n' == response.encode():
        return 0

    # ADMIN PRIV REQUIRED
    if 'Run as administrator' in response:
        return 2
    
    return response

def search(keyword:str):
    rules = subprocess.run('netsh advfirewall firewall show rule name=all', capture_output=True, shell=True).stdout.decode()
    parsed_rules = _parse_rule(_extract_rules(rules))
    extracted_rules = [tuple(rule.values()) for rule in parsed_rules]
    search_results = []
    for rule in extracted_rules:
        for each_value in rule:
            if keyword.casefold() in each_value.casefold():
                search_results.append(parsed_rules[extracted_rules.index(rule)])
                break
    
    return search_results


def delete(ruleName:str) -> None:
    subprocess.run(f'netsh advfirewall firewall delete rule name="[ICEBOX] {ruleName}"', capture_output=True, shell=True).stdout.decode()

#! NOT IMPLEMENTED
def edit(ruleName:str, new_values:dict) -> None:
    attributes = str()
    for key, value in new_values.items():
        attributes += f'{key}="{value}" '
    subprocess.run(f'netsh advfirewall firewall set rule name="[ICEBOX] {ruleName}" new {attributes}', capture_output=True, shell=True).stdout.decode()

if __name__ == "__main__":
    data = {'ruleName': 'Vulnweb', 'direction': 'outgoing', 'action': 'blocked', 'localIpAddress': '', 'localPort': None, 'remoteIpAddress': 'test.vulnweb.com', 'remotePort': 80, 'protocol': 'tcp'}
    # print(create_rule(name='TMKOC', action='allow', dir='out', protocol='tcp', localip='0.0.0.0', localport=1234))
    # create_rule(name=data['ruleName'], 
    #         dir=data['direction'], 
    #         action=data['action'], 
    #         localip=data['localIpAddress'], 
    #         remoteip=data['remoteIpAddress'], 
    #         localport=data['localPort'], 
    #         remoteport=data['remotePort'], 
    #         protocol=data['protocol'])
    # print(show_rules())
    # edit rules
    edit('fatpig', {'action': 'allow', 'dir': 'in'})
    # edit('fatpig', {'action': 'block'})