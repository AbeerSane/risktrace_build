$disputeId = "c145ed4e-f2fc-4e96-b12a-19266c75d2be" # Replace with a strong case ID
$response = Invoke-RestMethod -Uri "http://localhost:8080/api/disputes/$disputeId/ai-investigate" -Method Post
$response | ConvertTo-Json -Depth 5
