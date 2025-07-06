# ABC-Hotel Web Application
A personalized hotel room booking platform for ABC-Hotel. This repo contains only frontend code.

## Overview
The ABC-Hotel Web Application is a full-stack hotel management and booking platform 
built with Angular (frontend) and Spring Boot (backend). It showcases the luxurious 
offerings of ABC-Hotel in Goa, featuring a responsive UI with a carousel, room search 
functionality, amenities display, and information about the hotel's location, dining, 
and attractions. The app is designed to provide an engaging user experience for guests 
to explore rooms, amenities, and local attractions, with a mobile-friendly layout optimized 
for desktop, tablet, and mobile devices.

## Key Features
- Book hotel rooms.
- Search by your booking confirmation code.
- Hero Carousel: Displays stunning hotel images with navigation controls (Bootstrap 5.3.7).
- Room Search: Allows users to search for available rooms via a custom <app-roomsearch> component.
- Amenities Section: Showcases 15 amenities (e.g., Air Conditioning, Wi-Fi, Pet Friendly Apartments) using Bootstrap Icons, with uniform card heights and responsive grid layout.
- Browse All Rooms: Mobile-friendly section with a hotel image and "Browse All Rooms" button, styled for responsiveness.
- Additional Sections: About Us, Speciality (e.g., Goa Konkan Thali), Special Hut House, Location (Google Maps), Why Choose Us, Top Places to Visit in Goa, Testimonials, and Call-to-Action.
- Responsive Design: Optimized for desktop (3-4 columns), tablet (2 columns), and mobile (1 column) 
using CSS media queries and Bootstrap.

## Technologies

- Frontend:
- Angular 19.x
- Bootstrap 5.3.7 (CSS and JS)
- Bootstrap Icons 1.11.3
- Poppins font (via font-family: 'Poppins', sans-serif)

## Backend:
- Spring Boot 3.x
- Java 17
- Spring Data JPA, Spring Web for room search API


## Dependencies:
- Node.js 18.x or later
- npm 9.x or later
- Maven 3.8.x or later


## External Resources:
- CDN for Bootstrap: https://cdn.jsdelivr.net/npm/bootstrap@5.3.7
- CDN for Bootstrap Icons: https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3
- Google Maps Embed API for location section
- Unsplash images for About Us, Why Choose Us, and Top Places sections



## Prerequisites

- Node.js: Version 18.x or higher (includes npm)
- Angular CLI: Version 17.x (npm install -g @angular/cli)
- Java: JDK 17
- Maven: Version 3.8.x or higher
- Git: For cloning the repository
- IDE: VS Code, IntelliJ IDEA, or similar for frontend and backend development
- Browser: Chrome, Firefox, or Edge for testing

## Installation

Clone the Frontend Repository:
git clone https://github.com/AadityaUoHyd/abc-hotel.git
cd abc-hotel


## Frontend Setup (Angular):
```
Navigate to the Angular project directory:cd abc-hotel


Install dependencies : npm install --force
To Run : npm start

Verify Bootstrap and Bootstrap Icons in index.html:<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js"></script>

```


## Backend Setup (Spring Boot):
```
Navigate to the Spring Boot project directory (assumed to be in the root or a subdirectory, e.g., backend):cd backend

Install Maven dependencies:mvn clean install

Configure database (using MySQL via cloud, you can use mysql or H2 or postgresql in localhost or cloud or docker)
 in application.properties (adjust as needed):spring.datasource.url=jdbc:h2:mem:hoteldb

Running the Application

Start the Backend (Spring Boot):

From the backend directory:mvn spring-boot:run

The backend typically runs on http://localhost:8080.

Access the Application:

Open http://localhost:4200 in a browser.
Test features: carousel navigation, room search, amenities display, and Browse All Rooms button.
```


## Project Structure
```
abc-hotel-app/
├── abc-hotel/                  # Angular frontend, will be deployed in vercel
│   ├── src/
│   │   ├── app/
│   │   │   ├── home/
│   │   │   │   ├── home.component.html    # Main page with carousel, amenities, etc.
│   │   │   │   ├── home.component.css     # Styles for home page
│   │   │   │   ├── home.component.ts      # Component logic
│   │   │   ├── roomsearch/                # Room search component
│   │   │   ├── roomresult/                # Room results component
│   │   ├── assets/
│   │   │   ├── images/                    # Images (hero1.png, browse.png, etc.)
│   │   ├── index.html                     # Main HTML with Bootstrap CDNs
│   │   ├── styles.css                     # Global styles
│   ├── angular.json
│   ├── package.json
├── abc-hotel-backend/                    # Spring Boot backend (will be dockerized for deployment)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   ├── resources/
│   │   │   │   ├── application.properties # Database and server config
│   ├── pom.xml
│   ├── .env
├── README.md
```

## Usage
- Home Page (http://localhost:4200):
- Carousel: View hotel images with navigation buttons and indicators.
- Room Search: Use the <app-roomsearch> component to search for rooms, displaying results in <app-roomresult>.
- Amenities: Browse 15 amenities (e.g., Wi-Fi, Pet Friendly Apartments) in a responsive grid (3-4 columns on desktop, 2 on tablet, 1 on mobile).
- Browse All Rooms: Click the "Browse All Rooms" button to navigate to /rooms.
- Other Sections: Explore About Us, Speciality, Special Hut House, Location, Why Choose Us, Top Places, Testimonials, and Book Now sections.


## Contributing
- Fork the repository.
- Create a feature branch (git checkout -b feature/your-feature).
- Commit changes (git commit -m "Add your feature").
- Push to the branch (git push origin feature/your-feature).
- Open a pull request with a detailed description.

## License
This project is licensed under the MIT License.

## Dummy Test User
Admin credentials : aadi@yopmail.com/Password#123
User Credentials : santosh@yopmail.com/Password#123

## Live link (if deployed)
https://abc-hotel.vercel.app