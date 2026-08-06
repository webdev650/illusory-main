"use client";
import React, { useState, useEffect } from "react";
import { servicesAPI } from "../../services/api";
import ServicesShowcase from "./ui/ServicesShowcase";

const Services = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await servicesAPI.getAll();
        setItems(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <section id="services" className="min-h-screen py-[60px] md:py-[70px] w-full px-6 lg:px-20 flex justify-center">
      <div className="w-full max-w-7xl">
        <div>
          <p className="md:w-[400px] font-general text-white/80">
            What do we offer- As a tight knit team of experts, we create
            memorable and emotional websites, digital experiences and digital
            apps.
          </p>
        </div>
        <ServicesShowcase items={items} />
      </div>
    </section>
  );
};

export default Services;


