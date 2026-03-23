content = """ASI1_API_KEY=sk_d1dcb84615d049d5ba92a166d328e5e0353c52fc3ae2491eb572fa2bf6672b07
GEMINI_API_KEY=AIzaSyAVJwFrfiwPqKLnNu1QoNxFMQlXM6OfWeU
AGENTVERSE_KEY=eyJhbGciOiJSUzI1NiJ9.eyJleHAiOjY1MDQ1MDQxNzksImlhdCI6MTc3NDEwNDE3OSwiaXNzIjoiZmV0Y2guYWkiLCJqdGkiOiJiY2ViMTgzZDJiMDY2OTg1NjFjNjFmZTMiLCJzY29wZSI6ImF2Iiwic3ViIjoiM2U5MjFmOGY5ZjNiMWI5MmI4YmUzNmIxMzZkN2Q1YmFhNTFlZjQ5ZTU0OTc3ODYyIn0.k0FswCb37Op_qJxxsr3JVzucIy0cs2dR3R7cECyj1vpyy1PStfcq1h9Dzg9ERbyeeLusPvM9x3z0yT1vcwruXwUjIyN-BjUsTsgvENGFuC3MQLMpF_ljt6qf1B97E5wua3olYj5IBIc8-2ZclpEn9WPLh8DJlXtdzG6bAKIhentcrjZ0jdBgCVW4iLve7F8ObJNS5sEbu8c0bom6AEcoVzyuVrwnSXXOMDW6u2QtGc_JBlfw0S6KsUi5qHsmEmhZ5RkEerMEsMEvwa8VOpPFz4fofFXrYQKJUMwPJvSlVpJbUeoPfvkqxbotOr9mh3PxqqE8C3HLnPAIwcWzi8Ewlg"""

with open('.env', 'w', encoding='utf-8') as f:
    f.write(content)

print('✓ .env file created without BOM')

# Verify
with open('.env', 'rb') as f:
    data = f.read()
    bom = data[:3].hex()
    print(f'BOM check: {bom if bom != "efbbbf" else "✓ No BOM"}')
