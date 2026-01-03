# Copy dan paste ini saja di PowerShell:

$body = @{
name = "Super Admin"
email = "admin@test.com"
password = "admin123"
} | ConvertTo-Json

Write-Host "Sending request..."
Invoke-RestMethod -Uri "http://localhost:8080/api/auth/create-admin" -Method Post -Body $body -ContentType "application/json"
Write-Host "Request completed!"

# Untuk platform seperti Heroku, Vercel, Railway, dll

[System.BitConverter]::ToString((1..32 | ForEach-Object { Get-Random -Maximum 256 })).Replace("-","").ToLower()

CREATE_FIRST_ADMIN=true
FIRST_ADMIN_EMAIL=admin@yourapp.com
FIRST_ADMIN_PASSWORD=ChangeThisPassword123!
ADMIN_INVITATION_CODE=SUPER_SECRET_CODE_2024

import User from "./models/user.model.js";

const createFirstAdmin = async () => {
if (process.env.CREATE_FIRST_ADMIN === 'true') {
try {
const existingAdmin = await User.findOne({ role: 'admin' });
if (!existingAdmin) {
const adminUser = new User({
name: process.env.FIRST_ADMIN_NAME,
email: process.env.FIRST_ADMIN_EMAIL,
password: process.env.FIRST_ADMIN_PASSWORD,
role: 'admin'
});
await adminUser.save();
console.log('✅ First admin user created automatically');
}
} catch (error) {
console.log('⚠️ Auto admin creation skipped:', error.message);
}
}
};

// Panggil setelah koneksi database
connectDB().then(() => {
createFirstAdmin();
});


STRIPE 
Press Enter to open the browser or visit https://dashboard.stripe.com/stripecli/confirm_auth?t=WOIhocnQBCoDfB32ov5N8lsFfwCfwKuc (^C to quit)
> Done! The Stripe CLI is configured for RullyS sandbox with account id acct_1SFS9v2Nbmf5gSSd

Please note: this key will expire after 90 days, at which point you'll need to re-authenticate.
PS D:\CodeSistency\Udemy\mern-ecommerce-refactorV2\backend> 

PS D:\CodeSistency\Udemy\mern-ecommerce-refactorV2\backend> ./stripe listen --forward-to localhost:5000/api/v1/payments/webhook
> Ready! You are using Stripe API Version [2025-09-30.clover]. Your webhook signing secret is whsec_4e6856bb7a3fc7f39bd98b89c54b5fb3ec6a39741c7efd1b292c3e75d76ad8be (^C to quit)
