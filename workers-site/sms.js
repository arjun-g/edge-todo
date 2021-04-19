export async function sendSMS(number, message){
    /* TODO */

    console.log(`Sending message "${message}"`);

    const endpoint = "https://api.twilio.com/2010-04-01/Accounts/" + ACCOUNT_SID + "/Messages.json"

    let encoded = new URLSearchParams()
    encoded.append("To", number)
    encoded.append("From", FROM_NUMBER)
    encoded.append("Body", message)

    let token = btoa(ACCOUNT_SID + ":" + AUTH_TOKEN)

    const request = {
        body: encoded,
        method: "POST",
        headers: {
        "Authorization": `Basic ${token}`,
        "Content-Type": "application/x-www-form-urlencoded"
        }
    }

    let result = await fetch(endpoint, request)
    result = await result.json()

    return new Response(JSON.stringify(result), request)
}