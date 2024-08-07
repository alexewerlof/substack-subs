This is a simple script that fetches recommendation stats from Substack.

# Why does it exist?

Because the Substack UI doesn't give the information I was looking for:

* How many subs do I get in return for recommending another substack?
* What is the diff of the above?

# How to run it?

1. [Install Deno](https://docs.deno.com/runtime/manual/getting_started/installation/)
1. Pull this repo: `git pull git@github.com:alexewerlof/substack-subs.git`
1. Go to the repo directory: `cd substack-subs`
1. Make a copy of the example environment file: `cp example.env .env`
1. Open the `.env` file and put your domain there. Don't forget the quotes. Don't add `/` at the end.
1. You need to get a cookie to make this script run as if it was you in the browser. To get the cookie do this (only need to do it once):
   - Go to https://substack.com/home on your browser
   - Make sure you're logged in
   - Click the "Dashboard" botton at the top right corner
   - Open the development tools: <kbd>F12</kbd>
   - Go to `Network` tab
   - Refresh the page to log some requests
   - Filter the network requests by clicking on `Fetch/XHR`
   - Click on any request to get access to `Request Headers`
   - Grab the value of the `Cookie:` header
   - Put it in the `.env` file. Don't forget the quotes. It should be in one line
1. Run it with Deno: `deno run --allow-net --allow-read main.ts`

**Tip: I like to redirect the output to a file and read it in VS Code: `deno run --allow-net --allow-read main.ts > output`**