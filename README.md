# Nobel Prize Search

## Overview

This project is a simple application that allows users to search for Nobel Prize awards. The application features a backend built with Node.js that supports real-time updates via WebSocket and a frontend developed with Next.js (app router).

## Demo

Watch the Loom recording for a demonstration of the application: [Nobel Prize Search Demo](https://www.loom.com/share/3ff9f4ab619244c087c69487612a7e17?sid=a1bbb209-cd13-402a-bf12-d4e7b5c1cebd)


## Features

- **Basic Search Functionality:** Users can search Nobel Prize awards by entering terms into a text field. Matching awards are displayed as a list.
- **Real-Time Updates:** The backend provides real-time updates through WebSocket.
- **Imperfect Matches:** The search accommodates differences in whitespace, spelling, etc.
- **Auto-Complete:** Users get suggestions as they type.
- **Ordering Results:** Results can be ordered by the quality of the match.
- **Managing Results:** Data headers can be hidden and shown dynamically


## Getting Started

### Prerequisites

- Node.js (>= 14.x)
- npm (>= 6.x)

### Backend Setup

1. Navigate to the `node-backend` directory:
    ```bash
    cd node-backend
    ```

2. Install the necessary dependencies:
    ```bash
    npm install
    ```

3. Run the backend server:
    ```bash
    node server.js
    ```
    The server will start and listen for WebSocket connections, providing real-time updates.

### Frontend Setup

1. Navigate to the `mindset-health` directory:
    ```bash
    cd mindset-health
    ```

2. Install the necessary dependencies:
    ```bash
    npm install
    ```

3. Run the development server:
    ```bash
    npm run dev
    ```
    The frontend will be available at [http://localhost:3000](http://localhost:3000).

### Running Tests


- **Frontend Tests:**
    Navigate to the `mindset-health` directory and run:
    ```bash
    npm test
    ```

## Project Structure

- **node-backend:** Contains the Node.js backend server, which reads the Nobel Prize data locally and supports real-time updates via WebSocket.
- **mindset-health:** Contains the Next.js frontend application, which provides the user interface for searching and viewing Nobel Prize awards.

## Notes

- Ensure both the backend server and the frontend development server are running for the complete application experience.
- The WebSocket connection should automatically handle real-time updates in the frontend.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
