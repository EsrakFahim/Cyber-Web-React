import gsap from "gsap";
import React, { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LocomotiveScroll from "locomotive-scroll"; // Impor
import "./App.css";
import Navbar from "./Components/Navbar";
import MainPage from "./Pages/MainPage";
import Page1 from "./Pages/Page1";
import Page2 from "./Pages/Page2";
import Page3 from "./Pages/Page3";

function App() {
      const canvasRef = useRef(null);

      useEffect(() => {
            gsap.registerPlugin(ScrollTrigger);

            const locoScroll = new LocomotiveScroll({
                  el: document.querySelector("#main"),
                  smooth: true,
            });

            locoScroll.on("scroll", ScrollTrigger.update);

            ScrollTrigger.scrollerProxy("#main", {
                  scrollTop(value) {
                        return arguments.length
                              ? locoScroll.scrollTo(value, 0, 0)
                              : locoScroll.scroll.instance.scroll.y;
                  },
                  getBoundingClientRect() {
                        return {
                              top: 0,
                              left: 0,
                              width: window.innerWidth,
                              height: window.innerHeight,
                        };
                  },
                  pinType: document.querySelector("#main").style.transform
                        ? "transform"
                        : "fixed",
            });

            ScrollTrigger.addEventListener("refresh", () =>
                  locoScroll.update()
            );
            ScrollTrigger.refresh();

            const frameCount = 300;
            const images = [];
            console.log(images)
            const imageSeq = {
                  frame: 1,
            };

            for (let i = 0; i < frameCount; i++) {
                  const img = new Image();
                  img.src =
                        process.env.PUBLIC_URL +
                        `/img/male${String(i + 1).padStart(4, "0")}.png`;

                  // Handle image loading error
                  img.onerror = () => {
                        console.error(`Error loading image: ${img.src}`);
                        const index = images.indexOf(img);
                        if (index !== -1) {
                              images.splice(index, 1); // Remove the problematic image from the array
                        }
                        render(); // Re-render after removing the image
                  };

                  img.onload = () => render(); // Re-render after each image loads successfully

                  images.push(img);
            }

            gsap.to(imageSeq, {
                  frame: frameCount - 1,
                  snap: "frame",
                  ease: "none",
                  scrollTrigger: {
                        scrub: 0.15,
                        trigger: `#page>canvas`,
                        start: `top top`,
                        end: `600% top`,
                        scroller: `#main`,
                  },
                  onUpdate: () => render(),
            });

            images[1].onload = render;

            function render() {
                  const context = canvasRef.current.getContext("2d");

                  // Check if the image is defined and has loaded successfully
                  if (
                        images[imageSeq.frame] &&
                        images[imageSeq.frame].complete
                  ) {
                        scaleImage(images[imageSeq.frame], context);
                  }
            }

            function scaleImage(img, ctx) {
                  const canvas = ctx.canvas;

                  if (img) {
                        const hRation = canvas.width / img.width;
                        const vRation = canvas.height / img.height;
                        const ratio = Math.max(hRation, vRation);
                        const centerShift_x =
                              (canvas.width - img.width * ratio) / 2;
                        const centerShift_y =
                              (canvas.height - img.height * ratio) / 2;
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(
                              img,
                              0,
                              0,
                              img.width,
                              img.height,
                              centerShift_x,
                              centerShift_y,
                              img.width * ratio,
                              img.height * ratio
                        );
                  }
            }

            ScrollTrigger.create({
                  trigger: "#page>canvas",
                  pin: true,
                  scroller: `#main`,
                  start: `top top`,
                  end: `600% top`,
            });
      }, []);

      return (
            <div className="">
                  <Navbar />
                  <div id="main">
                        <MainPage canvasRef={canvasRef} />
                        <Page1 />
                        <Page2 />
                        <Page3 />
                  </div>
            </div>
      );
}

export default App;
