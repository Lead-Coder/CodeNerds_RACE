import pandas as pd
from gensim.models import Word2Vec
import os

# Load the dataset
df = pd.read_csv(r'f:\CodeNerds_RACE\ML\skill2vec_1K.csv', header=None)

# Prepare the corpus: each row is a list of skills
corpus = df.iloc[:, 1:].values.tolist()

# Remove NaN values and convert to strings
corpus = [[str(skill) for skill in row if pd.notnull(skill)] for row in corpus]

# Train the Word2Vec model
model = Word2Vec(sentences=corpus, vector_size=100, window=5, min_count=1, workers=4)

# Save the model
model.save(r"ML/models/skill2vec.model")