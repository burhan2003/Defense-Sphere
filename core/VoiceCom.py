import speech_recognition as sr

# dictionary of applications to control using voice
app_dic = {'Net-Monitor': ('network monitoring system', 'network monitor'),
           'Pen-Test': ('penetration testing', 'pen testing', 'pentesting')}

# no space containing phrases are allowed
positiveWords = ('activate', 'turn-on', 'open')

# no space containing phrases are allowed
ignoreWords = ("not", "no", "don't", "never", "none", 
        "neither", "nor", "cannot", "can't", "won't", 
        "shouldn't", "wouldn't", "couldn't", "doesn't", 
        "didn't", "isn't", "aren't", "wasn't", "weren't", 
        "hasn't", "haven't", "hadn't", "without", "lacking", 
        "fail", "failure", "unable", "unwilling", "deny", 
        "refuse", "reject", "against", "no one", "nobody",
        "nowhere", "nothing", "few", "less", "seldom", 
        "hardly", "rarely", "barely", "deactivate", "turn-off")

class Siri:

    @staticmethod
    def __positive_or_negative(text:str) -> int|None:
        if any(word in text.split() for word in positiveWords):
            return 1
        elif any(word in text.split() for word in ignoreWords):
            return 0
    
    def __determine_application_requested(text:str) -> str|None:
        applications_tuple = tuple(app_dic.values())
        for index in range(len(applications_tuple)):
            if any(possibility in text for possibility in applications_tuple[index]):
                return tuple(app_dic.keys())[index]

    @classmethod
    def __take_decision(cls, text) -> dict:
        return (cls.__determine_application_requested(text), cls.__positive_or_negative(text))

    @classmethod
    def __init__(cls):
        recognizer, microphone= sr.Recognizer(), sr.Microphone()
        print("Listening...")
        with microphone as source:
            recognizer.adjust_for_ambient_noise(source)
            while True:
                try:
                    audio = recognizer.listen(source)
                    text = str(recognizer.recognize_google(audio))
                    print(cls.__take_decision(text.casefold()))
                except sr.UnknownValueError:
                    print("[x1] Google Web Speech API could not understand the audio")
                except sr.RequestError as e:
                    print(f"[x2] Could not request results from Google Web Speech API; {e}")
                except KeyboardInterrupt:
                    print("[x3] Stopped by user")
                    break

Siri()