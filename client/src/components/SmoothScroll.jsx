// components/SmoothScroll.jsx
import React, { useEffect, useRef } from "react";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";
import { useLocation } from "react-router-dom";

const SmoothScroll = ({ children }) => {
    const containerRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        if (!containerRef.current) return;

        const scroll = new LocomotiveScroll({
            el: containerRef.current,
            smooth: true,
            multiplier: 1,
            smartphone: { smooth: true },
            tablet: { smooth: true },
        });

        return () => {
            scroll.destroy();
        };
    }, []);

    // Jab route change ho to top pe le jao
    useEffect(() => {
        setTimeout(() => {
            if (containerRef.current) {
                window.scrollTo(0, 0);
            }
        }, 100);
    }, [location.pathname]);

    return (
        <div data-scroll-container ref={containerRef}>
            {children}
        </div>
    );
};

export default SmoothScroll;
