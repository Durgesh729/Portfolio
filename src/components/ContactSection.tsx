import { useState } from "react";
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import "./ContactButton.css";
import "./ContactInput.css";
import "./FlipCard.css";
import "./BrutalistSocials.css";
import FriendsStack from "@/components/FriendsStack";
import DecryptedText from "./DecryptedText";
import AnimatedContent from "./AnimatedContent";
import ProfileCard from "@/components/ProfileCard";

const contactInfo = [
  {
    icon: null,
    label: "𝓔𝖒𝖆𝖎𝖑",
    value: "Durgeshpadwal729@gmail.com",
    href: "Durgeshpadwal729@gmail.com"
  },
  {
    icon: null,
    label: "𝓛𝔬𝔠𝔞𝔱𝔦𝔬𝔫",
    value: "Maharashtra, India",
    href: ""
  },
  {
    icon: null,
    label: "𝓟𝓻𝓸𝓯𝓮𝓼𝓼𝓲𝓸𝓷𝓪𝓵 𝓙𝓸𝓾𝓻𝓷𝓮𝔂",
    value: "Memories",
    href: null
  }
];

const socialLinks = [
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" }
];

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const { toast } = useToast();

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      // Focus the first input/textarea after the flip animation
      setTimeout(() => {
        const backSide = document.querySelector('.flip-card-back');
        if (backSide) {
          const firstInput = backSide.querySelector('input, textarea') as HTMLElement;
          if (firstInput) firstInput.focus();
        }
      }, 800);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_key: "4064a6d2-594f-42e2-8ea0-e73f437d2aec",
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          to_email: "Durgeshpadwal729@gmail.com",
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Message Sent! ✅",
          description: "Thank you for reaching out. I'll get back to you soon!",
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast({
          title: "Failed to send",
          description: "Something went wrong. Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please check your connection and try again.",
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full glass-card text-sm text-white mb-4">
            Contact
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">
              <DecryptedText
                text=" Let's Connect"
                animateOn="view"
                revealDirection="start"
                sequential={true}
                speed={100}
              />
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Have a project in mind or just want to chat? Feel free to reach out!
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Cards */}
            {contactInfo.map((info, index) => (
              <AnimatedContent
                key={info.label}
                distance={50}
                direction="horizontal"
                reverse={false}
                duration={3}
                delay={index * 0.2}
                scale={0.95}
                threshold={0.1}
                animateOpacity={true}
              >
                <div className="flip-card info-card">
                  <div className="flip-card-inner">
                    <div className="flip-card-front">
                      <div className="flex flex-col items-center gap-2">
                        {info.icon && <info.icon className="w-8 h-8 text-primary" />}
                        <p className="title text-2xl">{info.label}</p>
                      </div>
                    </div>
                    <div className="flip-card-back">
                      <p className="title text-sm px-2 text-center break-words w-full">
                        {info.href ? (
                          <a href={info.href} className="hover:underline">
                            {info.value}
                          </a>
                        ) : (
                          info.value
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedContent>
            ))}

            {/* Social Links & Friends */}
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold">Follow Me</h3>
                <FriendsStack />
              </div>

              <div className="flex justify-center sm:justify-start transform scale-90 sm:scale-100 origin-top-left">
                <div className="brutalist-container scale-[0.8] origin-top-left -mt-2 -ml-2">
                  <div className="slab-bg slab-1"></div>
                  <div className="slab-bg slab-2"></div>

                  <div className="concrete-block gradient-border">
                    <div className="concrete-texture"></div>
                    <div className="paper-texture"></div>

                    <div className="main-content">
                      <div className="title-text">SOCIAL LINKS</div>

                      <div className="social-grid">
                        <div className="social-cell">
                          <a href="https://github.com/Durgesh729" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                            <svg viewBox="0 0 24 24" className="social-icon">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                            </svg>
                          </a>
                        </div>
                        <div className="social-cell">
                          <a href="https://linkedin.com/in/durgeshpadwal" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            <svg viewBox="0 0 24 24" className="social-icon">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                            </svg>
                          </a>
                        </div>
                        <div className="social-cell">
                          <a href="https://leetcode.com/u/durgesh729/" target="_blank" rel="noopener noreferrer" aria-label="LeetCode">
                            <svg viewBox="0 0 24 24" className="social-icon">
                              <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"></path>
                            </svg>
                          </a>
                        </div>
                       <div className="social-cell">
                          <a
                            href="https://www.codewars.com/users/Durgesh729"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Codewars"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              className="social-icon"
                              fill="currentColor"
                            >
                              <path d="M1.072.142A1.072 1.072 0 0 0 0 1.214v21.572a1.072 1.072 0 0 0 1.072 1.072h21.856A1.072 1.072 0 0 0 24 22.786V1.214A1.072 1.072 0 0 0 22.928.142zm9.736 1.818a.904.904 0 0 1 .828.539.784.784 0 0 1 1.274.493.639.639 0 0 1 .29-.06c.33.008.59.262.625.575a1.322 1.322 0 0 1 .624-.515 1.325 1.325 0 0 1 1.718.71 1.098 1.098 0 0 1 .306-.236 1.102 1.102 0 0 1 1.483.479 1.094 1.094 0 0 1 .12.47.994.994 0 0 1 1.322 1.214.904.904 0 0 1 .874 1.438.784.784 0 0 1 .176 1.356.639.639 0 0 1 .19.224.642.642 0 0 1-.011.613 1.326 1.326 0 0 1 .482.235 1.334 1.334 0 0 1 .258 1.842 1.098 1.098 0 0 1 .35.15 1.102 1.102 0 0 1 .337 1.516 1.094 1.094 0 0 1-.344.344.994.994 0 0 1 .228 1.318 1.006 1.006 0 0 1-.605.434.904.904 0 0 1-.803 1.482.814.814 0 0 0-.008-.04.784.784 0 0 1-1.075.873.639.639 0 0 1-.098.28.625.625 0 0 1-.43.288 1.33 1.33 0 0 1 .023.456 1.334 1.334 0 0 1-1.44 1.173 1.098 1.098 0 0 1 .054.377 1.102 1.102 0 0 1-1.128 1.072 1.098 1.098 0 0 1-.47-.12.994.994 0 0 1-1.696.583.904.904 0 0 1-1.685.075.784.784 0 0 1-1.274-.493.639.639 0 0 1-.29.064.64.64 0 0 1-.621-.58l.004-.007a1.326 1.326 0 0 1-.632.523 1.334 1.334 0 0 1-1.718-.706 1.098 1.098 0 0 1-.306.232 1.102 1.102 0 0 1-1.48-.478 1.094 1.094 0 0 1-.123-.471.994.994 0 0 1-1.318-1.21.904.904 0 0 1-.874-1.442.784.784 0 0 1-.176-1.356.639.639 0 0 1-.194-.224.642.642 0 0 1 .011-.61l.019.004a1.326 1.326 0 0 1-.497-.239 1.334 1.334 0 0 1-.262-1.845 1.098 1.098 0 0 1-.35-.146 1.102 1.102 0 0 1-.337-1.52 1.094 1.094 0 0 1 .347-.34A.994.994 0 0 1 2.88 9a.904.904 0 0 1 .803-1.48.784.784 0 0 1 1.083-.836.639.639 0 0 1 .098-.28.649.649 0 0 1 .433-.288 1.33 1.33 0 0 1-.026-.452A1.334 1.334 0 0 1 6.716 4.49a1.098 1.098 0 0 1-.06-.377 1.101 1.101 0 0 1 1.13-1.073 1.094 1.094 0 0 1 .47.115.994.994 0 0 1 1.696-.579.904.904 0 0 1 .857-.617zM3.683 7.519a.784.784 0 0 0 .008.041l-.004-.04a.904.904 0 0 0-.004-.001zM17.502 19.61a1.098 1.098 0 0 0-.002-.004h-.037a1.334 1.334 0 0 0 .039.004zM13.825 3.507a1.322 1.322 0 0 0-.008.012l.008-.011zm-2.369-.014l-.003.003a.9.9 0 0 1-.665.27.896.896 0 0 1-.583-.232.994.994 0 0 1-.986.732.99.99 0 0 1-.362-.075 1.098 1.098 0 0 1-1.061 1.046 1.326 1.326 0 0 1 .123.736 1.334 1.334 0 0 1-.725 1.035 1.1 1.1 0 0 1 .307.795 1.106 1.106 0 0 1-.232.65c.321.18.53.523.523.915a1.016 1.016 0 0 1-.07.337.915.915 0 0 1 .82.937.923.923 0 0 1-.01.138.74.74 0 0 1 .157-.01c.343.007.627.25.702.57a.661.661 0 0 1 .38-.111c.31.007.561.224.632.511a.418.418 0 0 1 .381-.015 1.352 1.352 0 0 1 .303-.63.418.418 0 0 1-.12-.143.422.422 0 0 1 .004-.392.665.665 0 0 1-.325-1.117.736.736 0 0 1-.359-.336.74.74 0 0 1 .385-1.023.747.747 0 0 0-.06.026.915.915 0 0 1-.201-.262.915.915 0 0 1 .623-1.315V6.53a1.02 1.02 0 0 1 .437-1.371 1.012 1.012 0 0 1 .553-.112 1.11 1.11 0 0 1 .598-1.054 1.12 1.12 0 0 1 .06-.026.642.642 0 0 1-.109-.21.784.784 0 0 1-.455.132.784.784 0 0 1-.662-.396zm4.573 1.512a1.326 1.326 0 0 1-.587.46 1.334 1.334 0 0 1-1.255-.142v-.011a1.11 1.11 0 0 1-.553.66 1.106 1.106 0 0 1-.683.113 1.02 1.02 0 0 1-.553.889 1.016 1.016 0 0 1-.329.105.918.918 0 0 1-.43 1.169.923.923 0 0 1-.127.056.74.74 0 0 1 .086.13.738.738 0 0 1-.168.89.661.661 0 0 1 .28.283.655.655 0 0 1-.149.796.418.418 0 0 1 .153.164c.019.034.03.068.038.101a1.356 1.356 0 0 1 .672-.015.422.422 0 0 1 .056-.142.422.422 0 0 1 .34-.194.665.665 0 0 1 .796-.848.736.736 0 0 1 .112-.478.733.733 0 0 1 1.016-.224.915.915 0 0 1 .127-.306.915.915 0 0 1 1.27-.28.915.915 0 0 1 .179.153 1.02 1.02 0 0 1 1.408-.314 1.012 1.012 0 0 1 .374.422c.355-.24.833-.261 1.214-.015a1.11 1.11 0 0 1 .209.172.642.642 0 0 1 .082-.108.784.784 0 0 1-.332-.337.784.784 0 0 1 .03-.77.9.9 0 0 1-.553-.455.896.896 0 0 1-.075-.624.994.994 0 0 1-1.117-.511.994.994 0 0 1-.104-.359 1.098 1.098 0 0 1-1.427-.43zM5.249 7.37a.784.784 0 0 1-.124.46.784.784 0 0 1-.68.362c.06.235.026.49-.112.71a.896.896 0 0 1-.5.377c.31.325.373.829.12 1.225a.99.99 0 0 1-.255.269 1.098 1.098 0 0 1 .351 1.45 1.326 1.326 0 0 1 .691.276 1.334 1.334 0 0 1 .512 1.154c.28-.064.579-.019.84.15a1.106 1.106 0 0 1 .438.53 1.02 1.02 0 0 1 1.05.03 1.016 1.016 0 0 1 .257.231.914.914 0 0 1 1.225-.224.919.919 0 0 1 .112.086.74.74 0 0 1 .071-.142.74.74 0 0 1 .852-.306.661.661 0 0 1 .1-.381.664.664 0 0 1 .763-.273.418.418 0 0 1 .246-.373 1.36 1.36 0 0 1-.358-.523v-.008a.418.418 0 0 1-.25.075.422.422 0 0 1-.344-.19.665.665 0 0 1-1.132-.243.736.736 0 0 1-.47.149.733.733 0 0 1-.718-.755.915.915 0 0 1-.329.049.915.915 0 0 1-.855-1.177h-.004a1.016 1.016 0 0 1-.993-1.042 1.012 1.012 0 0 1 .168-.534 1.11 1.11 0 0 1-.64-1.035 1.11 1.11 0 0 1 .068-.358.65.65 0 0 1-.1-.019zm11.127 2.133a.913.913 0 0 1-1.225.224.926.926 0 0 1-.112-.082.74.74 0 0 1-.067.142.74.74 0 0 1-.852.302.661.661 0 0 1-.105.385.662.662 0 0 1-.762.277.418.418 0 0 1-.063.212.426.426 0 0 1-.075.086 1.356 1.356 0 0 1 .314.564.418.418 0 0 1 .187-.04.422.422 0 0 1 .343.194.665.665 0 0 1 1.136.242.736.736 0 0 1 .467-.153c.41.008.728.348.72.755a.74.74 0 0 1 0 .008v-.005a.915.915 0 0 1 .326-.052.915.915 0 0 1 .896.941.919.919 0 0 1-.037.236c.564.015 1.008.482.993 1.046a1.012 1.012 0 0 1-.168.534 1.11 1.11 0 0 1 .647 1.035 1.11 1.11 0 0 1-.075.362l.004-.007.1.018a.784.784 0 0 1 .124-.46.784.784 0 0 1 .68-.362.9.9 0 0 1 .112-.71.896.896 0 0 1 .504-.373.994.994 0 0 1-.123-1.225.99.99 0 0 1 .257-.269 1.098 1.098 0 0 1-.35-1.453 1.326 1.326 0 0 1-.696-.273h-.003a1.334 1.334 0 0 1-.512-1.158 1.082 1.082 0 0 1-.837-.145 1.106 1.106 0 0 1-.44-.535 1.02 1.02 0 0 1-1.05-.026 1.016 1.016 0 0 1-.258-.235zm-.094 3.116l-.007.066a.74.74 0 0 0 .007-.066zm-2.864-.259a1.36 1.36 0 0 1-.363.598.418.418 0 0 1 .194.187.422.422 0 0 1-.007.396.665.665 0 0 1 .329 1.113.736.736 0 0 1 .358.336.739.739 0 0 1-.32.994.915.915 0 0 1 .197.261.91.91 0 0 1-.396 1.233.919.919 0 0 1-.224.082v.004a1.02 1.02 0 0 1-.44 1.374 1.012 1.012 0 0 1-.55.109 1.11 1.11 0 0 1-.661 1.083.642.642 0 0 1 .112.21.026.026 0 0 1-.004 0v.003a.784.784 0 0 1 .456-.134.784.784 0 0 1 .661.392.9.9 0 0 1 .665-.27.896.896 0 0 1 .587.236.994.994 0 0 1 .982-.736.99.99 0 0 1 .362.079v.022a1.1 1.1 0 0 1 1.061-1.072 1.326 1.326 0 0 1-.123-.736c.056-.46.34-.837.725-1.035l.003.004a1.102 1.102 0 0 1-.31-.795 1.106 1.106 0 0 1 .232-.654 1.02 1.02 0 0 1-.452-1.251.915.915 0 0 1-.822-.934.923.923 0 0 1 .011-.142.74.74 0 0 1-.157.015.74.74 0 0 1-.698-.572.661.661 0 0 1-.385.112.667.667 0 0 1-.627-.512.418.418 0 0 1-.217.053.418.418 0 0 1-.18-.045zm-.964.93a1.36 1.36 0 0 1-.336.042c-.112 0-.22-.012-.322-.038a.418.418 0 0 1-.06.295.422.422 0 0 1-.343.195.665.665 0 0 1-.792.844.736.736 0 0 1-.112.478.74.74 0 0 1-1.02.224.915.915 0 0 1-.127.306.915.915 0 0 1-1.266.28.919.919 0 0 1-.183-.153v.004a1.02 1.02 0 0 1-1.408.31 1.012 1.012 0 0 1-.374-.418c-.355.239-.83.261-1.214.015a1.113 1.113 0 0 1-.21-.172.65.65 0 0 1-.081.105.784.784 0 0 1 .336.336.784.784 0 0 1-.034.77.89.89 0 0 1 .553.455.896.896 0 0 1 .075.624.994.994 0 0 1 1.12.515.99.99 0 0 1 .101.355 1.098 1.098 0 0 1 1.431.43 1.326 1.326 0 0 1 .587-.46c.43-.172.896-.104 1.255.142a1.106 1.106 0 0 1 .549-.65 1.106 1.106 0 0 1 .683-.108 1.02 1.02 0 0 1 .553-.893 1.02 1.02 0 0 1 .333-.104.916.916 0 0 1 .425-1.17.919.919 0 0 1 .131-.052.736.736 0 0 1-.09-.134.738.738 0 0 1 .169-.886.661.661 0 0 1-.28-.284.67.67 0 0 1 .149-.799.418.418 0 0 1-.15-.164.418.418 0 0 1-.048-.24z" />
                            </svg>
                          </a>
                        </div>
                        </div>
                      </div>
                    </div>

                    <div className="scan-effect"></div>

                    <div className="rivet"></div>
                    <div className="rivet"></div>
                    <div className="rivet"></div>
                    <div className="rivet"></div>

                    <div className="type-accent">&nbsp;&nbsp;Network</div>

                    <div className="corner-bracket bracket-tl"></div>
                    <div className="corner-bracket bracket-tr"></div>
                    <div className="corner-bracket bracket-bl"></div>
                    <div className="corner-bracket bracket-br"></div>
                  </div>
                </div>
              </div>
            </div>

          {/* Click-to-Flip Card Container */}
          <div className="lg:col-span-3 flex justify-center items-center h-full">
            <div 
              className={`flip-card profile-flip-card ${isFlipped ? 'flipped' : ''}`} 
              onClick={handleFlip}
              role="button"
              tabIndex={0}
              aria-label="Flip to contact form"
              aria-expanded={isFlipped}
              onKeyDown={(e) => {
                const target = e.target as HTMLElement;
                if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'BUTTON') return;
                if (e.key === 'Enter' || e.key === ' ') {
                  handleFlip();
                }
              }}
            >
              <div className="flip-card-inner">
                {/* Front Side: Profile Card */}
                <div className="flip-card-front" aria-hidden={isFlipped}>
                  <div className="w-full transform hover:scale-105 transition-transform duration-300">
                    <ProfileCard
                      name="Durgesh H Padwal"
                      title="Python Developer"
                      handle="@Durgesh"
                      status="Busy"
                      contactText="Contact Me"
                      avatarUrl="/portfoliocolorphoto.webp"
                      enableTilt={true}
                      onContactClick={() => {
                        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    />
                  </div>
                </div>

                {/* Back Side: Contact Card (Form) */}
                <div className="flip-card-back" aria-hidden={!isFlipped}>
                  <form 
                    onSubmit={(e) => {
                      e.stopPropagation(); // Prevent flip on form submit
                      handleSubmit(e);
                    }} 
                    className="glass-card p-8 rounded-2xl space-y-6 w-full h-full text-left"
                    onClick={(e) => e.stopPropagation()} // Prevent flip when clicking inside the form
                    onKeyDown={(e) => e.stopPropagation()} // Prevent flip when pressing keys inside the form
                  >
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                          Name
                        </label>
                        <div className="form-control">
                          <input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your name"
                            required
                            className="input input-alt"
                          />
                          <span className="input-border input-border-alt"></span>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                          Email
                        </label>
                        <div className="form-control">
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            required
                            className="input input-alt"
                          />
                          <span className="input-border input-border-alt"></span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2">
                        Subject
                      </label>
                      <div className="form-control">
                        <input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="What's this about?"
                          required
                          className="input input-alt"
                        />
                        <span className="input-border input-border-alt"></span>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Message
                      </label>
                      <div className="form-control">
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell me about your project..."
                          required
                          rows={4}
                          className="input input-alt"
                        />
                        <span className="input-border input-border-alt"></span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center gap-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="contact-send-btn flex-1"
                      >
                        <div className="svg-wrapper-1">
                          <div className="svg-wrapper">
                            <Send className="w-5 h-5" />
                          </div>
                        </div>
                        <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFlip();
                        }}
                        className="p-3 glass-card rounded-xl hover:bg-white/10 transition-colors"
                        aria-label="Back to profile"
                      >
                        Back
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
