import pickle
import string
from nltk.stem.porter import PorterStemmer
from nltk.corpus import stopwords
import nltk

# Preprocessing function for new emails
def _preprocess_text(text):
    text = text.lower()
    text = text.translate(str.maketrans('', '', string.punctuation))
    words = [stemmer.stem(word) for word in text.split() if word not in stopwords_set]
    return ' '.join(words)

def run(email:str) -> int:

    nltk.download('stopwords')

    # Load the pre-trained model and CountVectorizer
    model = pickle.load(open('core/model.pkl', 'rb'))
    vectorizer = pickle.load(open('core/vectorizer.pkl', 'rb'))  # Save vectorizer separately

    # Initialize stopwords and stemmer
    global stopwords_set, stemmer
    stopwords_set = set(stopwords.words('english'))
    stemmer = PorterStemmer()
    
    # Preprocess and transform the email text
    processed_text = _preprocess_text(email)
    text_features = vectorizer.transform([processed_text])

    # Predict
    prediction = model.predict(text_features)[0]
    # label = 'spam' if prediction == 1 else 'ham'

    return prediction