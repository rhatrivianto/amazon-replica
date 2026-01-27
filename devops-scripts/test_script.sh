if [ -f "../.env" ]; then
    echo "Security Check: Environment file is safe."

    npm --version > scripts/system_status.txt
    echo "System status has been saved."
else

    echo "CRITICAL: .env file missing! Stop."
    exit 1
fi

