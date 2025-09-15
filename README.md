# NextTalk - Real-time Chat App

NextTalk is a modern real-time chat application built with Next.js, featuring:

- Email/password authentication (JWT)
- 1:1 and group chat rooms
- Real-time messaging (Socket.IO)
- Message persistence (MongoDB)
- Online/away presence & typing indicators
- Responsive UI with Shadcn UI components
- User avatars with fallback icons

## Getting Started

## Getting Started

First, install dependencies and run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Navigate to [http://localhost:3000](http://localhost:3000) to use the app.

## Features

- Sign in and sign up pages
- Chat room UI: left sidebar (contacts with avatars), right (messages & input)
- Optimized image config for external avatars
- Professional Inter font and improved metadata

## Production Branch Workflow

To create and push a production branch:

```sh
git checkout -b production
git merge main
git push origin production
```

## Learn More

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy

Deploy easily on Vercel or your preferred platform. See [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying).
