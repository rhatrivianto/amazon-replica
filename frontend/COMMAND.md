Compress-Archive -Path frontend,backend,infrastructure,docker-compose.yml -DestinationPath project.zip


Compress-Archive -Path frontend -DestinationPath frontend.zip
Compress-Archive -Path backend -DestinationPath backend.zip
Compress-Archive -Path infrastructure -DestinationPath infrastructure.zip
Compress-Archive -Path docker-compose.yml,Dockerfile -DestinationPath docker-config.zip  // salah
Compress-Archive -Path docker-config -DestinationPath docker-config.zip

fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: "willy@test.com",
    password: "Abd123456"
  })
})
.then(r => r.json())
.then(console.log)