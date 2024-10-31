const url2 = "https://oauth2.googleapis.com/token";
const params = {
  code: '4/0AVG7fiR5E3wlUhniCG5y8YgdH5vDZxAFmhX65iiv54UYvCtwSP5kfQiJkBFkiZlVG5xuIQ',
  client_id: '387330197465-k1rliup96791v78e5d7agvh4o0eig3p3.apps.googleusercontent.com',
  client_secret: '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',
  redirect_uri: 'http://localhost:5501/callback',
  grant_type: 'authorization_code'
};

fetch(url2, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: new URLSearchParams(params)
})
.then(response => response.json())
.then(data => {
  console.log("Access Token:", data.access_token);
  console.log("Refresh Token:", data.refresh_token);
})
.catch(error => console.error("Lỗi:", error));

