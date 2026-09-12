import urllib.request
import json

# Test 1: Config
req = urllib.request.urlopen("http://127.0.0.1:8000/api/config/")
config = json.loads(req.read().decode('utf-8'))
print("Config API OK:", config['status'], config['data']['title'])

# Test 2: Questions
req = urllib.request.urlopen("http://127.0.0.1:8000/api/questions/")
questions = json.loads(req.read().decode('utf-8'))
print("Questions API OK. Total:", questions['total'])
print("Q1:", questions['questions'][0]['text'])
print("Q40:", questions['questions'][39]['text'])

# Test 3: Candidate Validation
cand_data = json.dumps({"name": "Test Candidate", "email": "candidate@example.com"}).encode('utf-8')
cand_req = urllib.request.Request("http://127.0.0.1:8000/api/candidate/validate/", data=cand_data, headers={'Content-Type': 'application/json'})
cand_res = json.loads(urllib.request.urlopen(cand_req).read().decode('utf-8'))
print("Candidate Validation API OK:", cand_res['status'])

# Test 4: Submit Exam
submit_payload = json.dumps({
    "candidate": {"name": "Test Candidate", "email": "candidate@example.com"},
    "answers": {"1": "C", "2": "C", "3": "B", "4": "C", "5": "A"},
    "time_spent_seconds": 120
}).encode('utf-8')
sub_req = urllib.request.Request("http://127.0.0.1:8000/api/submit/", data=submit_payload, headers={'Content-Type': 'application/json'})
sub_res = json.loads(urllib.request.urlopen(sub_req).read().decode('utf-8'))
print("Exam Submit API OK:", sub_res['status'])
print("Score:", sub_res['data']['submission_summary']['score'], "/", sub_res['data']['submission_summary']['total_questions'])
print("Pass/Fail:", sub_res['data']['submission_summary']['status'])
