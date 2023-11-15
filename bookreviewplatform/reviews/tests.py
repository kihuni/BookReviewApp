from django.test import TestCase
import requests

def test_google_books_api():
    base_url = "https://www.googleapis.com/books/v1/volumes"
    query = "Python programming"
    params = {"q": query}

    response = requests.get(base_url, params=params)

    if response.status_code == 200:
        data = response.json()
        print("API response:")
        print(data)
    else:
        print(f"Error: {response.status_code}, {response.text}")

if __name__ == "__main__":
    test_google_books_api()
