import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef, useState } from "react";
import DeepDiveVideo from "assets/videos/deepdive-home-video.mp4";

const ModalVideo = ({ thumb }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const videoRef = useRef(null);

  return (
    <div>
      {/* Video thumbnail */}
      <div>
        <div
          className="relative flex justify-center mb-8"
          data-aos="zoom-y-out"
          data-aos-delay="450"
        >
          <div className="flex flex-col justify-center shadow-2xl rounded-xl border-1">
            <video
              className="w-full sm:w-[750px]"
              src={DeepDiveVideo}
              playsInline
              loop
              autoPlay
              muted
              poster={thumb}
            />
          </div>
          <button
            className="absolute top-full flex items-center transform translate-y-4 bg-white rounded-full font-medium group p-4 shadow-lg"
            onClick={() => {
              setModalOpen(true);
            }}
          >
            <svg
              className="w-6 h-6 fill-current text-gray-400 group-hover:text-blue-600 shrink-0"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0 2C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12z" />
              <path d="M10 17l6-5-6-5z" />
            </svg>
            <span className="ml-3">Watch the full video (4 min)</span>
          </button>
        </div>
      </div>
      {/* End: Video thumbnail */}

      <Transition show={modalOpen} as={Fragment}>
        <Dialog initialFocus={videoRef} onClose={() => setModalOpen(false)}>
          {/* Modal backdrop */}
          <Transition.Child
            className="fixed inset-0 z-[99999] bg-black bg-opacity-75 transition-opacity"
            enter="transition ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition ease-out duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            aria-hidden="true"
          />
          {/* End: Modal backdrop */}

          {/* Modal dialog */}
          <Transition.Child
            className="fixed inset-0 z-[99999] overflow-hidden flex items-center justify-center transform px-4 sm:px-6"
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ttransition ease-out duration-200"
            leaveFrom="oopacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="max-w-6xl mx-auto w-full h-full flex items-center aspect-video">
              <Dialog.Panel className="flex w-full h-1/3 sm:h-2/3 bg-black overflow-hidden">
                <div className="flex w-full h-full flex-col">
                  <iframe
                    className="flex flex-grow w-full h-full"
                    src="https://www.youtube.com/embed/mZ9mRn0zGo8?autoplay=1"
                    title="DeepDive Demo video"
                    frameborder="0"
                    allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; autoplay"
                  ></iframe>
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
          {/* End: Modal dialog */}
        </Dialog>
      </Transition>
    </div>
  );
};

export default ModalVideo;
