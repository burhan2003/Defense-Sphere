import torch

# Set the Torch API endpoint URL
torch_api_url = 'https://api.torch.dark.fail/search'

# Set the search query
search_query = 'search+query'

# Set the request headers
headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}

# Set the request parameters
params = {
    'query': search_query,
    'limit': 10,  # Set the number of results to retrieve
    'offset': 0   # Set the offset for pagination
}

# Make the request to the Torch API
response = torch.requests.get(torch_api_url, headers=headers, params=params)

# Check if the request was successful
if response.status_code == 200:
    # Parse the JSON response
    results = response.json()
    # Process the search results
    for result in results:
        print(result['title'])
        print(result['url'])
        print(result['snippet'])
        print('---')
else:
    print('Failed to retrieve search results.')