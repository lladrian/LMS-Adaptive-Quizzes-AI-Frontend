import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  return (
    <>
    <div className="min-h-screen bg-sky-100 text-sky-900 font-sans -space-y-15">
      <header className="bg-sky-500 text-white shadow-lg fixed top-0 left-0 w-full z-50 mb-20">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between">
          <h1 className="text-3xl font-bold">ADR | MAN </h1>
          <nav className="mt-4 md:mt-0">
            <ul className="flex flex-wrap gap-4 text-white font-medium">
              <li>
                <a href="#home" className="hover:text-sky-200 transition duration-200">Home</a>
              </li>
              <li>
                <a href="#about" className="hover:text-sky-200 transition duration-200">About</a>
              </li>
              <li>
                <a href="#skills" className="hover:text-sky-200 transition duration-200">Skills</a>
              </li>
              <li>
                <a href="#projects" className="hover:text-sky-200 transition duration-200">Projects</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-sky-200 transition duration-200">Contact</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <section className="p-6 max-w-4xl mx-auto mb-5" id="home">

      </section>

      <section className="p-6 max-w-4xl mx-auto">
          <div className="text-center my-10">
          <img
            src="https://fastly.picsum.photos/id/805/600/400.jpg?hmac=z2F7GIksIsmoNamiDlsr5tnvVd8OvAyWAc_l6oKYsKI"
            alt="Profile"
            className="rounded-full mx-auto border-4 border-sky-400"
          />
          <h2 className="text-2xl font-semibold mt-4">Adrian Manatad</h2>
          <p className="text-sky-700">Backend Developer | Fullstack Developer | Mobile App Developer</p>
        </div>
      </section>

      <section className="p-6 max-w-4xl mx-auto mb-5" id="about">

      </section>

      <section className="p-6 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-2xl shadow-md md:col-span-2">
          {/* <div className="bg-white p-6 rounded-2xl shadow-md"> */}
            <h3 className="text-xl font-semibold text-sky-600 mb-2">About Me</h3>
            <p className="indent-5 text-justify">
              Known for my ability to adapt quickly, problem solving and project coordination. 
              I am looking forward to the opportunity to utilize my skills, experience, and passion 
              as a valuable addition to your team. Together, we can achieve remarkable results!              
            </p>
          </div>
      </section>

      <section className="p-6 max-w-4xl mx-auto mb-5" id="skills">

      </section>

     
      <section className="p-6 max-w-4xl mx-auto mb-0">
          <div className="bg-white p-6 rounded-2xl shadow-md md:col-span-2">
            <h3 className="text-xl font-semibold text-sky-600 mb-2">Simple Projects</h3>
            <ul className="list-disc pl-5">
              <li>Expense Tracker API</li>
              <li>Blogging Platform API</li>
              <li>GitHub User Activity API</li>
              <li>Todo List API</li>
              <li>Weather API</li>
              <li>URL Shortener API</li>
              <li>Expense Tracker CLI</li>
              <li>Number Guessing Game CLI</li>
              <li>Task Tracker CLI</li>
              <li>TMDB Tool CLI</li>
              <li>Test Payment Gateway (Paymongo, Paypal, Stripe)</li>
              <li>SMTP Message Sender</li>
            </ul>
          </div>
      </section>

      <section className="p-6 max-w-4xl mx-auto mb-0">
          <div className="bg-white p-6 rounded-2xl shadow-md md:col-span-2">
            <h3 className="text-xl font-semibold text-sky-600 mb-2">Large-Scale Projects</h3>
            <ul className="list-disc pl-5">
              <li>EVSU INC Processing and Approval Support System</li>
              <li>EVSU Navigation Kiosk System</li>
              <li>Company Omnichannel System</li>
              <li>Customer Feedback System</li>
              <li>AgriFarm System</li>
            </ul>
          </div>
      </section>

      {/* <section className="p-6 max-w-4xl mx-auto mb-0" id="contact">

      </section> */}

      
      <section className="p-0 max-w-4xl mx-auto mb-10" id="contact">

      </section>

      <section className="p-6 max-w-4xl mx-auto mb-0">
         {/* Contact Form */}
        <div className="bg-white p-6 rounded-2xl shadow-md mt-6">
          <h3 className="text-xl font-semibold text-sky-600 mb-4">Contact Form</h3>
          <form>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" className="mt-1 p-2 border border-gray-300 rounded-md w-full" name="name" placeholder="Your Name" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" className="mt-1 p-2 border border-gray-300 rounded-md w-full" name="email"  placeholder="Your Email Address" required />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <textarea className="mt-1 p-2 border border-gray-300 rounded-md w-full" rows="4" name="message" placeholder="Your Message" required></textarea>
            </div>
            <div className="mt-4">
              <button type="submit" className="w-full bg-sky-600 text-white p-2 rounded-md hover:bg-sky-700">Send Message</button>
            </div>
          </form>
        </div>
      </section>

      <section className="p-6 max-w-4xl mx-auto mb-0">
        <div className="bg-white p-6 rounded-2xl shadow-md md:col-span-2">
          <h3 className="text-xl font-semibold text-sky-600 mb-2">Contact Information</h3>
          <ul className="list-disc pl-5">
            <li>Email: <span className="text-sky-600 text-sm">adrianmanatad5182@gmail.com</span></li>
            <li>Phone: <span className="text-sky-600 text-sm">+639704531346</span></li>
            <li>Facebook: <a href="https://www.facebook.com/manatad333" target="_blank" className="text-sky-500 hover:underline text-sm">facebook.com/manatad333</a></li>
            <li>GitHub: <a href="https://github.com/lladrian" target="_blank" className="text-sky-500 hover:underline text-sm">github.com/lladrian</a></li>
          </ul>
        </div> 
      </section>

      <footer className="text-center bg-sky-500 text-white py-4 mt-10">
        &copy; 2025 Adrian Manatad. All rights reserved.
      </footer>
    </div>
    </>
  )
};

export default Home
