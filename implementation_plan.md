# Hostel Complaint Management Web System

## Goal Description
The objective is to create a responsive, modern, and beautifully designed web application for managing hostel complaints. The system will feature two main portals:
- **Student Portal**: Allows students to submit new complaints, view existing complaints from peers, and upvote relevant issues. Students will also receive notifications when their complaints are marked as solved.
- **Admin Portal**: Allows administration staff to view all submitted complaints, track their status, sort by upvotes or date, and update the status of complaints to "Solved".

The application will be built using modern web development practices (React + Vite) and feature a premium UI/UX design with smooth micro-animations, glassmorphism UI elements, and a clean typography hierarchy. Since no backend was specified, the app will use browser local storage and React context to persist state and simulate data flow across the system between multiple "users".

> [!IMPORTANT]
> **User Review Required**
> 1. To keep the setup simple and fully functional as a frontend web app, I plan to use `localStorage` to save the complaints and use a simple portal selection screen (Choose "Log in as Student" or "Log in as Admin") instead of a full authentication backend with a database. Is this acceptable?
> 2. Will you need a specific color scheme (e.g., college brand colors)? If not, I will use a premium, sleek dark mode aesthetic with vibrant accent colors.

## Proposed Changes

### Configuration and Setup
- Ensure the project is set up using Vite + React. 
- Clean up default Vite boilerplate and configure the routing system (using tools like `react-router-dom` if we need complex routing, or simple conditional rendering for a lighter SPA).

### Main Application Structure
- App layout with a unified Navigation bar to switch between portals or "log out".
- Landing page to identify the user's role (Admin / Student).

### Styling (Vanilla CSS)
- **`index.css` & `App.css`**: We will establish a foundational design system built entirely on vanilla CSS, using custom properties (variables) for consistent colors, typography, borders, and modern effects like box-shadow and backdrop-filter (glassmorphism).

### Components (`/src/components`)
- **`Layout`**: Main container for the pages.
- **`PortalSelector`**: A sleek landing screen to pick between Admin and Student.
- **`ComplaintForm`**: A visually appealing form for students to submit complaints.
- **`ComplaintCard`**: A reusable card to display individual complaints, including their status and an upvote button.
- **`NotificationToast`**: A pop-up notification system to alert students when their issues are resolved.
- **`AdminDashboard`**: A table or grid view for admins to view all system complaints and quick actions to update statuses.

## Open Questions
- Do you have any specific categories for the complaints (e.g., Maintenance, Cleaning, WiFi, Noise)? If not, I will add some reasonable default options.

## Verification Plan

### Automated Tests
- Validate the build correctness using `npm run build` after completing the application.

### Manual Verification
- We will manually test the user flow: logging in as a student, submitting a complaint, switching to admin, marking it as solved, and switching back to the student to ensure the notification is received and the status updates correctly.
