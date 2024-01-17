import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query } from 'firebase/firestore';
import 'dotenv/config'




// Firebase config
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fetch data from Firestore
const gamesCol = collection(db, 'games');
const gamesSnapshot = await getDocs(gamesCol);
const games = gamesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

const BlogsCol = collection(db, 'blogs');
const BlogsSnapshot = await getDocs(BlogsCol);
const blogs = BlogsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

// Resolvers
const resolvers = {
  Query: {
    games() {
      return games; 
    },
    blogs() {
      return blogs;
    }
  }
};

// types
const typeDefs = `#graphql
type Query {
    games: [Game!]!
    blogs: [Blog!]!
  }

  type Blog {
    id: ID!
    title: String!
    author: String!
    content: String!
  }

  type Game {
    id: ID!
    title: String!
    platform: [String!]!
  }
`;

// Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers  
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 }
});

console.log(`Server ready at: ${url}`);