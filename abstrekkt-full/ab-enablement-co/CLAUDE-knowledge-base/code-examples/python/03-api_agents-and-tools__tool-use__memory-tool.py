// --- block 8 (lang: python) ---
      def fetch_page(url, retries=3):
          for i in range(retries):
              try:
                  response = requests.get(url, timeout=5)
                  return response.text
              except requests.exceptions.Timeout:
                  if i == retries - 1:
                      raise
                  time.sleep(1)
      