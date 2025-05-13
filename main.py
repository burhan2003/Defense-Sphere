from flask import Flask, render_template, redirect, jsonify, abort, request
import psutil, threading, os, base64, time, socket
import core.Auth as auth
import core.FileIntegrity as FI
import core.Validation as Validation
import core.VPN as VPN
import core.CyberNews as Cybernews
import core.Phishing as Phishing
import core.ExtDev as xdev
import core.Logs as Logs
import core.FaceRecon as FaceRecon
import core.Firewall as Firewall
import core.IntraNetwork as IntraNetwork
import core.ComSoc as ComSoc

app = Flask(__name__)

EMP_LOGGEDIN, ADMIN_LOGGEDIN = False, False

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/about-us')
def about_us():
    return render_template('about-us.html')

@app.route('/articles')
def article():
    return render_template('articles.html')

@app.route('/articles/data')
def article_data():
    return jsonify(Cybernews.run())

@app.route('/support')
def support():
    return render_template('support.html')

@app.route('/dashboard')
def dashboard():
    if EMP_LOGGEDIN:
        return render_template('dashboard.html', name=name, role=role, userid=userID)
    elif ADMIN_LOGGEDIN:
        return redirect('/admin-dashboard')
    else:
        return redirect('/login')

@app.route('/dashboard/data')
def dasboard_data():
    data = {'ip': None,
            'ram': psutil.virtual_memory().percent,
            'rom': psutil.disk_usage('/').percent,
            'net': 73}
    return jsonify(data)

@app.route('/login', methods=['GET', 'POST'])
def login():
    global userID
    if request.method == 'POST':
        try:
            userID = int(request.form['user-id'])
        except:
            userID = -1
        password = request.form['password']

        global response, name, role, username, face
        response, name, role, username, face = auth.login(userID, password)

        # decode face data
        face = base64.b64decode(face.encode())
        global face_img
        face_img = f'core/{username}.jpg'
        with open(face_img, 'wb') as f:
            f.write(face)

        if response == 0:
            Logs.write_log(username, 'Loggedin')
            return redirect('/face-recon')
        elif response == 1:
            Logs.write_log(userID, 'Login attempt with wrong password')
        elif response == 2:
            Logs.write_log(userID, 'Login attempt with invalid userid')
    
    if EMP_LOGGEDIN:
        return redirect('/dashboard')
    elif ADMIN_LOGGEDIN:
        return redirect('/admin-dashboard')
    else:
        return render_template('login.html')

@app.route('/login/data')
def login_data():
    data = {'response':response, 'isAdmin':ADMIN_LOGGEDIN}
    return jsonify(data)

_2FA = False
@app.route('/forgot-password', methods=['GET', 'POST'])
def forgot_password():
    if request.method == 'POST':
        dataType, prompt = request.get_json().values()
        global row
        row = auth.forgot_password(dataType, prompt)
        print(row)
        if row:
            # fetch the face image
            face_data_enc = auth.hash_actions(row[1])[4]
            face_data = base64.b64decode(face_data_enc.encode())
            face_img = f'core/{prompt}.jpg'
            with open(face_img, 'wb') as f:
                f.write(face_data)

            f = FaceRecon.FaceRecon(1, face_img)

            if f.isAuthorized():
                global _2FA
                _2FA = True
                Logs.write_log(prompt, 'Biometric Scan Successful')
                return jsonify(1)

            return redirect('/forgot-password')
        
    return render_template('forgot-password.html')

@app.route('/reset-password', methods=['GET','POST', 'HEAD'])
def reset_password():
    if request.method == 'POST':
        new_password = request.get_json()['password']
        global row
        auth.reset_password(row, new_password)
        return jsonify(1)
    
    return render_template('reset-password.html')

@app.route('/settings')
def settings():
    if EMP_LOGGEDIN or ADMIN_LOGGEDIN:
        return render_template('settings.html')
    else:
        return abort(403)

notifications = []
@app.route('/notifications/data', methods=['GET'])
def notification_data():
    global notifications
    if EMP_LOGGEDIN or ADMIN_LOGGEDIN:
        action, index = request.args.get('action'), request.args.get('index')

        if action == 'display':
            return jsonify(notifications)
        elif action == 'remove':
            notifications.pop(int(index))
            return jsonify(0)
        elif action == 'clear':
            notifications.clear()
            return jsonify(0)
        
    else:
        return abort(403)
    
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        firstName = request.form['first-name']
        role = request.form['job-role']
        username = request.form['username']
        password = request.form['password']

        global userID
        userID = auth.register(firstName, role, username, password, register_face)

        Logs.write_log(userID, 'New account registered')
        print('Account Registered')

        return redirect('/login')

    return render_template('register.html')

@app.route('/register/data')
def register_data():
    data = {'userID':userID}
    return jsonify(data)

@app.route('/FI-Monitor', methods=['GET'])
def fi_monitoring():
    if EMP_LOGGEDIN or ADMIN_LOGGEDIN:
        task, file = request.args.get('task'), request.args.get('file')
        file, action = request.args.get('file'), request.args.get('action')

        if task and file:
            if task == 'add':
                FI.add(file)
                Logs.write_log(username, '<b>FMI:</b> File added')
            elif task == 'clear':
                FI.clear(file)
                Logs.write_log(username, '<b>FMI:</b> File cleared')
            elif task == 'remove':
                FI.remove(file)
                Logs.write_log(username, '<b>FMI:</b> File removed')
            elif task == 'pause':
                FI.pause(file)
                Logs.write_log(username, '<b>FMI:</b> File paused')
            elif task == 'resume':
                FI.resume(file)
                Logs.write_log(username, '<b>FMI:</b> File resumed')
            # -------------------------
            return redirect('/FI-Monitor')

        elif file and action:
            if action == 'open':
                Logs.write_log(username, '<b>FMI:</b> File opened')
                os.startfile(file)
            # --------------------------
            return redirect('/FI-Monitor')
        
        return render_template('fi-monitor.html')
    
    else:
        return redirect('/login')

@app.route('/FI-Monitor/data')
def fi_data():
    if EMP_LOGGEDIN or ADMIN_LOGGEDIN:
        return jsonify(FI.DATA)
    else:
        abort(403)

country_codes = {
    '+93': 'AF',  # Afghanistan
    '+355': 'AL',  # Albania
    '+49': 'DE',  # Germany
    '+376': 'AD',  # Andorra
    '+971': 'AE',  # United Arab Emirates
    '+1': 'US',  # United States
    '+44': 'GB',  # United Kingdom
    '+91': 'IN',  # India
    '+62': 'ID',  # Indonesia
    '+81': 'JP',  # Japan
    '+86': 'CN',  # China
    '+82': 'KR',  # South Korea
    '+61': 'AU',  # Australia
    '+55': 'BR',  # Brazil
    '+51': 'PE',  # Peru
    '+20': 'EG',  # Egypt
    '+60': 'MY',  # Malaysia
    '+52': 'MX',  # Mexico
    '+33': 'FR',  # France
    '+39': 'IT',  # Italy
    '+34': 'ES',  # Spain
    '+46': 'SE',  # Sweden
    '+41': 'CH',  # Switzerland
    '+7': 'RU',  # Russia
    '+64': 'NZ',  # New Zealand
    '+30': 'GR',  # Greece
    '+31': 'NL',  # Netherlands
    '+32': 'BE',  # Belgium
    '+45': 'DK',  # Denmark
    '+36': 'HU',  # Hungary
    '+421': 'SK',  # Slovakia
    '+421': 'SI',  # Slovenia
    '+372': 'EE',  # Estonia
    '+358': 'FI',  # Finland
    '+353': 'IE',  # Ireland
    '+354': 'IS',  # Iceland
    '+381': 'RS',  # Serbia
    '+373': 'MD',  # Moldova
    '+370': 'LT',  # Lithuania
    '+371': 'LV',  # Latvia
    '+381': 'BA',  # Bosnia and Herzegovina
    '+48': 'PL',  # Poland
    '+351': 'PT',  # Portugal
    '+30': 'CY',  # Cyprus
    '+994': 'AZ',  # Azerbaijan
    '+996': 'KG',  # Kyrgyzstan
    '+992': 'TJ',  # Tajikistan
    '+993': 'TM',  # Turkmenistan
    '+994': 'AZ',  # Azerbaijan
    '+995': 'GE',  # Georgia
}

@app.route('/dashboard/validate', methods=['POST'])
def profile():
    if EMP_LOGGEDIN or ADMIN_LOGGEDIN:

        data = request.get_json()
        keys = tuple(data.keys())

        if 'email' in keys:
            Logs.write_log(username, f'Email Validation - {data["email"]}')

            data = eval(Validation.check_email(data['email']).replace('true', 'True').replace('false', 'False').replace('null', 'None'))
            response = 1 if data['deliverability'] == 'DELIVERABLE' else 0
        
        elif 'country' in keys and 'phone' in keys:
            Logs.write_log(username, f'Phone Validation - +{data["country"]} {data["phone"]}')

            data = eval(Validation.check_phone(country_codes[data['country']], data['phone']).replace('true', 'True').replace('false', 'False').replace('null', 'None'))
            try:
                response = 1 if data['valid'] == True else 0
            except:
                response = 0
        
        elif 'iban' in keys:
            Logs.write_log(username, f'IBAN Validation - {data["iban"]}')

            data = eval(Validation.check_iban(data['iban']).replace('true', 'True').replace('false', 'False').replace('null', 'None'))
            try:
                response = 1 if data['valid'] == True else 0
            except:
                response = 0

        return jsonify(response)
    else:
        return redirect('/login')

# @app.route('/vpn', methods=['GET', 'POST'])
@app.route('/vpn', methods=['GET', 'POST'])
def vpn():
    if EMP_LOGGEDIN or ADMIN_LOGGEDIN:
        global vpnData
        if request.method == 'POST':
            v = request.get_json()

            is_tor_running = VPN.is_process_running()

            # dashboard load
            if v == 0:
                vpnData = VPN.proxy_data if is_tor_running else VPN.standard_vpn_fetch()
                return jsonify(vpnData)
            
            # toggle button clicked
            elif v == 1:
                if is_tor_running:
                    Logs.write_log(username, f'VPN Deactivated')
                    vpnData = VPN.kill()
                    return jsonify(vpnData)

                elif not is_tor_running:
                    Logs.write_log(username, f'VPN activated')
                    vpnData = VPN.run()
                    return jsonify(vpnData)
        else:
            # return jsonify(vpnData)
            return abort(403)

@app.route('/phishing', methods=['GET', 'POST'])
def phishing():
    if EMP_LOGGEDIN or ADMIN_LOGGEDIN:
        if request.method != 'POST':
            return render_template('phishing.html')
        else:
            data = request.get_json()
            email = data['content']
            
            if Phishing.run(email) == 0:
                response = 'safe'
            else:
                Logs.write_log(username, 'Caught a spam email !')
                response = 'danger'

            return jsonify(response)
    else:
        return redirect('/login')

@app.route('/password-gen')
def password_generator():
    if EMP_LOGGEDIN or ADMIN_LOGGEDIN:
        return render_template('password-generator.html')
    else:
        return abort(403)

@app.route('/logs')
def logs_manager():
    if EMP_LOGGEDIN or ADMIN_LOGGEDIN:
        return render_template('logs.html')
    else:
        return redirect('/login')

@app.route('/logs/data')
def logs_data():
    if EMP_LOGGEDIN or ADMIN_LOGGEDIN:
        data = Logs.read_logs()
        data.reverse()
        return jsonify(data)
    else:
        return abort(403)

@app.route('/firewall')
def firewall():
    if EMP_LOGGEDIN or ADMIN_LOGGEDIN:
        return render_template('firewall.html')
    else:
        return redirect('/login')
    
@app.route('/firewall/create-rule', methods=['GET', 'POST'])
def firewall_create_rule():
    if EMP_LOGGEDIN or ADMIN_LOGGEDIN:
        if request.method == 'POST':
            data = request.get_json()
            response = Firewall.create_rule(name=data['ruleName'], 
                                        dir=data['direction'], 
                                        action=data['action'],
                                        localip=data['localIpAddress'], 
                                        remoteip=data['remoteIpAddress'], 
                                        localport=data['localPort'], 
                                        remoteport=data['remotePort'], 
                                        protocol=data['protocol'])
            # response 0, 2, str<>
            Logs.write_log(username, f"Firewall Rule Created - {data['ruleName']}")
            return jsonify(response)
    else:
        return redirect('/login')
    
@app.route('/firewall/show-rules')
def firewall_show_rules():
    if EMP_LOGGEDIN or ADMIN_LOGGEDIN:
        global firewall_rules
        firewall_rules = Firewall.show_rules()
        return jsonify(firewall_rules)
    else:
        return redirect('/login')

@app.route('/firewall/delete-rule', methods=['POST'])
def firewall_delete_rule():
    if EMP_LOGGEDIN or ADMIN_LOGGEDIN:
        ruleName = request.get_json()
        Firewall.delete(ruleName)
        Logs.write_log(username, f'Firewall Rule Deleted - {ruleName}')
        return jsonify(0)
    else:
        return redirect('/login')

@app.route('/logout', methods=['POST'])
def logout():
    global EMP_LOGGEDIN, ADMIN_LOGGEDIN, Employee, directory
    if (EMP_LOGGEDIN or ADMIN_LOGGEDIN) and request.method == 'POST':
        Logs.write_log(username, 'Logged out')
        if EMP_LOGGEDIN:
            Employee.send_message(f'logout: {username}')
        elif ADMIN_LOGGEDIN:
            directory.httpd.shutdown()
        ComSoc.EMP_LOGGEDIN = False
        EMP_LOGGEDIN, ADMIN_LOGGEDIN = False, False
    return redirect('/login')

@app.route('/save-reference-image', methods=['POST'])
def save_reference_image():
    if 'image' not in request.files:
        return {'error': 'No image file'}, 400
        
    image_file = request.files['image']
    
    # Save the image
    img_path = 'reference.jpg'
    try:
        image_file.save(img_path)

        global register_face
        with open(img_path, 'rb') as f:
            register_face = base64.b64encode(f.read()).decode()
        
        os.remove(img_path)

        return {'success': True}, 200
    except Exception as e:
        print(f"Error saving image: {e}")
        return {'error': str(e)}, 500

def handle_admin_actions():

    def _continous_scan():
        while True:
            scanner.scan_network()
            time.sleep(2)

    # host the admin directory
    global directory
    directory = IntraNetwork.RemoteDirectory()
    directory.run()
    # start the continous network scan
    threading.Thread(target=_continous_scan).start()
    # start the admin server
    try:
        Admin = ComSoc.Admin()
        threading.Thread(target=Admin.run).start()
    except:
        print("[ERROR] Admin server already running")

def handle_emp_actions():
    # scan the network and find the admin
    global scanner, admin_ip, Employee
    print("Scanning network...")
    scanner.scan_network()
    admin_ip = scanner._find_admin()
    print(f"Admin at {admin_ip}")
    # start the employee server
    Employee = ComSoc.Employee(admin_ip)
    threading.Thread(target=Employee.run).start()
    Logs.write_log(username, 'Loggedin')
    # send message to admin about the login
    Employee.send_message(f'login: {username}')


@app.route('/face-recon')
def face_recon():
    f = FaceRecon.FaceRecon(1, face_img)
    global EMP_LOGGEDIN, ADMIN_LOGGEDIN
    if f.isAuthorized():
        FI.voice_alert(f'Hi {name}')

        # initiate the network scanner
        global scanner
        scanner = IntraNetwork.NetworkScanner()

        if username == 'administrator':
            ADMIN_LOGGEDIN = True
            handle_admin_actions()
            return redirect('/admin-dashboard')
        
        EMP_LOGGEDIN = True
        handle_emp_actions()
        return redirect('/dashboard')
    else:
        redirect('/login')

@app.route('/admin-dashboard')
def admin_dashboard():
    if ADMIN_LOGGEDIN:
        return render_template('admin-dashboard.html', name=name, role=role, userid=userID)
    else:
        return redirect('/login')

@app.route('/admin-dashboard/active-ips')
def active_ips():
    if ADMIN_LOGGEDIN:
        data = dict()
        for ip in scanner.active_ips:
            data[ip] = 'Admin' if ip == socket.gethostbyname(socket.gethostname()) else ComSoc.EMP_LOGGEDIN
        return jsonify(data)
    else:
        return abort(403)



if __name__ == '__main__':

    # real-time file monitoring
    threading.Thread(target=FI.run).start()
    threading.Thread(target=xdev.run).start()

    # app.run(debug=True, use_reloader=False, host='0.0.0.0', port=6969)
    app.run(host='0.0.0.0', port=5000)