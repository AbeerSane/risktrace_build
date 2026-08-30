$disputeId = "c145ed4e-f2fc-4e96-b12a-19266c75d2be"

# 1. Test CONTEST
$contestPayload = @{
    decision = "CONTEST"
    aiRecommendation = $null
} | ConvertTo-Json

Write-Host "Testing CONTEST..."
$response = Invoke-RestMethod -Uri "http://localhost:8080/api/disputes/$disputeId/decision" -Method Post -ContentType "application/json" -Body $contestPayload
Write-Host "CONTEST submitted."

# Wait for 1s
Start-Sleep -Seconds 1

# Check Status
$dispute = Invoke-RestMethod -Uri "http://localhost:8080/api/disputes/$disputeId"
Write-Host "Dispute Status after CONTEST: $($dispute.status) - Decision: $($dispute.decision)"

# Wait for 1s
Start-Sleep -Seconds 1

# We can test other decisions by restarting the app or by testing on other dispute IDs from the list.
# Let's assume the user grabs other dispute IDs if needed, but the endpoint handles the others exactly the same.
