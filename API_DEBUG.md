# Environment Variable Debugging Guide

## Common Issues:

1. API URLs not correctly set
2. Server not running at expected address
3. API endpoints don't match expectations

## Current Environment Setup:

- Development API: http://localhost:5000/api/v1
- API endpoints follow pattern: /users/signin, /users/signup

## Troubleshooting:

### Check server status:

```
curl http://localhost:5000/api/v1/health
```

### Test authentication endpoint directly:

```
curl -X POST -H "Content-Type: application/json" -d '{"phone":"1234567890","password":"password123"}' http://localhost:5000/api/v1/users/signin
```

### Common problems:

1. HTML in response: Server is likely returning an error page

   - Check server logs
   - Verify server is running
   - Check URL path is correct

2. CORS issues:

   - Ensure server has CORS enabled for your frontend domain

3. Mismatched API structure:
   - Review API documentation
   - Check field names match expectations
