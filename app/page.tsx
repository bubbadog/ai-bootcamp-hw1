"use client";
import { useChat } from "ai/react";
import { useState } from "react";
import { Sparkles, Feather, BookOpen, Wand2 } from "lucide-react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat();

  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedPersonality, setSelectedPersonality] = useState(null);

  const programmingLanguages = [
    { 
      name: 'Python', 
      emoji: '🐍',
      color: '#3776ab', 
      bgColor: 'linear-gradient(135deg, #3776ab, #ffd43b)',
      concepts: ['elegant syntax', 'data science', 'machine learning', 'simplicity']
    },
    { 
      name: 'JavaScript', 
      emoji: '⚡',
      color: '#f7df1e', 
      bgColor: 'linear-gradient(135deg, #f0db4f, #323330)',
      concepts: ['async programming', 'event loops', 'callbacks', 'dynamic typing']
    },
    { 
      name: 'Rust', 
      emoji: '🦀',
      color: '#ce422b', 
      bgColor: 'linear-gradient(135deg, #ce422b, #000000)',
      concepts: ['memory safety', 'zero-cost abstractions', 'ownership', 'performance']
    },
    { 
      name: 'Go', 
      emoji: '🚀',
      color: '#00add8', 
      bgColor: 'linear-gradient(135deg, #00add8, #ffffff)',
      concepts: ['goroutines', 'channels', 'simplicity', 'concurrency']
    },
    { 
      name: 'TypeScript', 
      emoji: '📘',
      color: '#3178c6', 
      bgColor: 'linear-gradient(135deg, #3178c6, #ffffff)',
      concepts: ['type safety', 'interfaces', 'compilation', 'scalability']
    },
    { 
      name: 'C++', 
      emoji: '⚙️',
      color: '#00599c', 
      bgColor: 'linear-gradient(135deg, #00599c, #004482)',
      concepts: ['templates', 'pointers', 'performance', 'low-level control']
    }
  ];

  const aiPersonalities = [
    {
      name: 'Wise Mentor',
      icon: '🧙‍♂️',
      description: 'Ancient wisdom meets modern code',
      traits: ['philosophical', 'patient', 'insightful', 'nurturing'],
      color: 'linear-gradient(135deg, #667eea, #764ba2)'
    },
    {
      name: 'Curious Child',
      icon: '🤖',
      description: 'Wonder and excitement in every algorithm',
      traits: ['playful', 'questioning', 'enthusiastic', 'innocent'],
      color: 'linear-gradient(135deg, #f093fb, #f5576c)'
    },
    {
      name: 'Pragmatic Engineer',
      icon: '⚙️',
      description: 'Efficiency and logic drive every decision',
      traits: ['practical', 'logical', 'solution-focused', 'methodical'],
      color: 'linear-gradient(135deg, #4facfe, #00f2fe)'
    },
    {
      name: 'Creative Artist',
      icon: '🎨',
      description: 'Code as canvas, algorithms as art',
      traits: ['imaginative', 'expressive', 'innovative', 'aesthetic'],
      color: 'linear-gradient(135deg, #fa709a, #fee140)'
    },
    {
      name: 'Philosophical Thinker',
      icon: '🤔',
      description: 'Deep contemplation on digital existence',
      traits: ['reflective', 'existential', 'profound', 'contemplative'],
      color: 'linear-gradient(135deg, #a8edea, #fed6e3)'
    },
    {
      name: 'Rebellious Hacker',
      icon: '😎',
      description: 'Breaking rules, making new paths',
      traits: ['unconventional', 'bold', 'innovative', 'disruptive'],
      color: 'linear-gradient(135deg, #ff6a00, #ee0979)'
    }
  ];

  const generatePoem = () => {
    let prompt = "Write a beautiful short poem about coding and AI";
    
    if (selectedLanguage && selectedPersonality) {
      prompt = `Write a beautiful poem from the perspective of an AI with a "${selectedPersonality.name}" personality, reflecting on ${selectedLanguage.name} programming. Incorporate concepts like ${selectedLanguage.concepts.join(', ')} and embody traits that are ${selectedPersonality.traits.join(', ')}. The poem should feel ${selectedPersonality.description.toLowerCase()}.`;
    } else if (selectedLanguage) {
      prompt = `Write a beautiful poem about ${selectedLanguage.name} programming and AI, incorporating concepts like ${selectedLanguage.concepts.join(', ')}.`;
    } else if (selectedPersonality) {
      prompt = `Write a beautiful poem from the perspective of an AI with a "${selectedPersonality.name}" personality about coding. The AI should be ${selectedPersonality.traits.join(', ')} and embody the essence of "${selectedPersonality.description}".`;
    }

    append({
      role: "user",
      content: prompt,
    });
  };

  // Get the latest assistant message (poem)
  const latestPoem = messages.filter(m => m.role === "assistant").pop()?.content;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #581c87 0%, #1e3a8a 50%, #4338ca 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        pointerEvents: 'none'
      }}>
        <div style={{
          position: 'absolute',
          top: '-40px',
          left: '-40px',
          width: '384px',
          height: '384px',
          backgroundColor: 'rgba(168, 85, 247, 0.1)',
          borderRadius: '50%',
          filter: 'blur(48px)',
          animationName: 'pulse',
          animationDuration: '2s',
          animationIterationCount: 'infinite'
        }} />
        <div style={{
          position: 'absolute',
          top: '50%',
          right: '-40px',
          width: '320px',
          height: '320px',
          backgroundColor: 'rgba(236, 72, 153, 0.1)',
          borderRadius: '50%',
          filter: 'blur(48px)',
          animationName: 'pulse',
          animationDuration: '2s',
          animationIterationCount: 'infinite',
          animationDelay: '1s'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-40px',
          left: '33%',
          width: '288px',
          height: '288px',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderRadius: '50%',
          filter: 'blur(48px)',
          animationName: 'pulse',
          animationDuration: '2s',
          animationIterationCount: 'infinite',
          animationDelay: '0.5s'
        }} />
      </div>

      {/* Hero Section */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(90deg, rgba(147, 51, 234, 0.2) 0%, rgba(190, 24, 93, 0.2) 100%)'
        }} />
        
        <div style={{
          position: 'relative',
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '40px 16px 32px 16px',
          textAlign: 'center'
        }}>
          {/* Icon */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            marginBottom: '32px' 
          }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(90deg, #c4b5fd 0%, #fb7185 100%)',
                borderRadius: '50%',
                filter: 'blur(16px)',
                opacity: 0.75,
                animationName: 'pulse',
                animationDuration: '2s',
                animationIterationCount: 'infinite'
              }} />
              <div style={{
                position: 'relative',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(8px)',
                borderRadius: '50%',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <Feather style={{ width: '48px', height: '48px', color: 'white' }} />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '16px',
            letterSpacing: '-0.025em',
            lineHeight: '1'
          }}>
            AI Poem{' '}
            <span style={{
              background: 'linear-gradient(90deg, #c4b5fd 0%, #fb7185 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent'
            }}>
              Generator
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: '1.125rem',
            color: '#ddd6fe',
            marginBottom: '32px',
            maxWidth: '768px',
            margin: '0 auto 32px auto',
            lineHeight: '1.625'
          }}>
            Where artificial intelligence meets the art of poetry. Create beautiful, unique verses about coding and AI with the power of advanced language models.
          </p>

          {/* Programming Language Selection */}
          <div style={{
            marginBottom: '32px',
            maxWidth: '900px',
            margin: '0 auto 32px auto'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: 'white',
              textAlign: 'center',
              marginBottom: '16px'
            }}>
              Choose Your Programming Language
            </h3>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '24px'
            }}>
              {programmingLanguages.map((lang) => (
                <div
                  key={lang.name}
                  onClick={() => setSelectedLanguage(lang)}
                  style={{
                    background: selectedLanguage?.name === lang.name ? lang.bgColor : 'rgba(255, 255, 255, 0.1)',
                    border: selectedLanguage?.name === lang.name ? '2px solid white' : '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    transform: selectedLanguage?.name === lang.name ? 'scale(1.05)' : 'scale(1)',
                    backdropFilter: 'blur(8px)',
                    minWidth: '140px',
                    flex: '0 0 auto'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedLanguage?.name !== lang.name) {
                      e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                      e.target.style.transform = 'scale(1.02)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedLanguage?.name !== lang.name) {
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                      e.target.style.transform = 'scale(1)';
                    }
                  }}
                >
                  <div style={{
                    fontSize: '1.5rem',
                    marginBottom: '8px'
                  }}>
                    {lang.emoji}
                  </div>
                  <div style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '8px',
                    fontFamily: 'monospace'
                  }}>
                    {lang.name}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: selectedLanguage?.name === lang.name ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.7)',
                    lineHeight: '1.4'
                  }}>
                    {lang.concepts.slice(0, 2).join(' • ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Personality Selection */}
          <div style={{
            marginBottom: '32px',
            maxWidth: '900px',
            margin: '0 auto 32px auto'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: 'white',
              textAlign: 'center',
              marginBottom: '16px'
            }}>
              Choose AI Personality
            </h3>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '24px'
            }}>
              {aiPersonalities.map((personality) => (
                <div
                  key={personality.name}
                  onClick={() => setSelectedPersonality(personality)}
                  style={{
                    background: selectedPersonality?.name === personality.name ? personality.color : 'rgba(255, 255, 255, 0.1)',
                    border: selectedPersonality?.name === personality.name ? '2px solid white' : '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    transform: selectedPersonality?.name === personality.name ? 'scale(1.05)' : 'scale(1)',
                    backdropFilter: 'blur(8px)',
                    minWidth: '200px',
                    flex: '0 0 auto'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedPersonality?.name !== personality.name) {
                      e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                      e.target.style.transform = 'scale(1.02)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedPersonality?.name !== personality.name) {
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                      e.target.style.transform = 'scale(1)';
                    }
                  }}
                >
                  <div style={{
                    fontSize: '2rem',
                    marginBottom: '8px'
                  }}>
                    {personality.icon}
                  </div>
                  <div style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '8px'
                  }}>
                    {personality.name}
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: selectedPersonality?.name === personality.name ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.7)',
                    marginBottom: '8px',
                    fontStyle: 'italic'
                  }}>
                    {personality.description}
                  </div>
                  <div style={{
                    fontSize: '0.7rem',
                    color: selectedPersonality?.name === personality.name ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.6)'
                  }}>
                    {personality.traits.slice(0, 2).join(' • ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selection Summary */}
          {(selectedLanguage || selectedPersonality) && (
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '32px',
              maxWidth: '600px',
              margin: '0 auto 24px auto',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ color: '#ddd6fe', textAlign: 'center' }}>
                <div style={{ marginBottom: '8px', fontWeight: '500' }}>Your Poem Will Feature:</div>
                {selectedLanguage && (
                  <div style={{ marginBottom: '4px' }}>
                    {selectedLanguage.emoji} <strong>{selectedLanguage.name}</strong> programming concepts
                  </div>
                )}
                {selectedPersonality && (
                  <div>
                    {selectedPersonality.icon} <strong>{selectedPersonality.name}</strong> AI perspective
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Button */}
          <button
            onClick={generatePoem}
            disabled={isLoading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: isLoading 
                ? 'linear-gradient(90deg, #9333ea 0%, #db2777 100%)'
                : 'linear-gradient(90deg, #a855f7 0%, #ec4899 100%)',
              color: 'white',
              padding: '16px 32px',
              fontSize: '1.125rem',
              fontWeight: '600',
              borderRadius: '50px',
              border: 'none',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              transform: 'scale(1)',
              opacity: isLoading ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.background = 'linear-gradient(90deg, #9333ea 0%, #be185d 100%)';
                e.target.style.transform = 'scale(1.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.target.style.background = 'linear-gradient(90deg, #a855f7 0%, #ec4899 100%)';
                e.target.style.transform = 'scale(1)';
              }
            }}
          >
            {isLoading ? (
              <>
                <Wand2 style={{ marginRight: '8px', width: '20px', height: '20px' }} className="animate-spin" />
                Crafting Poetry...
              </>
            ) : (
              <>
                <Sparkles style={{ marginRight: '8px', width: '20px', height: '20px' }} />
                Generate a Poem
              </>
            )}
          </button>
        </div>
      </div>

      {/* Latest Poem Display */}
      {latestPoem && (
        <div style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1024px',
          margin: '0 auto',
          padding: '0 16px 48px 16px'
        }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(16px)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            padding: '32px',
            transition: 'transform 0.3s ease',
            margin: '0 auto',
            maxWidth: '800px'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
              <BookOpen style={{ width: '24px', height: '24px', color: '#c4b5fd', marginRight: '12px' }} />
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white', margin: 0 }}>
                Your Generated Poem
              </h2>
            </div>
            <pre style={{
              whiteSpace: 'pre-wrap',
              fontFamily: 'serif',
              fontSize: '1.125rem',
              color: '#ddd6fe',
              lineHeight: '1.625',
              margin: 0,
              textAlign: 'center'
            }}>
              {latestPoem}
            </pre>
          </div>
        </div>
      )}

      {/* Poetry Collection */}
      {messages.length > 1 && (
        <div style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1024px',
          margin: '0 auto',
          padding: '0 16px 48px 16px'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: 'white',
            textAlign: 'center',
            marginBottom: '24px'
          }}>
            Poetry Collection
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {messages.slice(0, -1).map((m) => (
              <div key={m.id}>
                {m.role === "assistant" && (
                  <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '24px',
                    transition: 'background-color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                      <Sparkles style={{ width: '20px', height: '20px', color: '#c4b5fd', marginRight: '8px' }} />
                      <span style={{ fontSize: '0.875rem', color: '#ddd6fe' }}>
                        AI Generated Poetry
                      </span>
                    </div>
                    <pre style={{
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'serif',
                      color: '#ddd6fe',
                      lineHeight: '1.625',
                      margin: 0,
                      textAlign: 'center'
                    }}>
                      {m.content}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Features Section */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 16px 40px 16px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '32px'
        }}>
          {[
            { 
              icon: Sparkles, 
              title: "AI-Powered", 
              desc: "Advanced language models create unique poetry about coding and technology" 
            },
            { 
              icon: Feather, 
              title: "Creative Expression", 
              desc: "Endless possibilities for artistic exploration of tech themes" 
            },
            { 
              icon: BookOpen, 
              title: "Instant Creation", 
              desc: "Generate beautiful poems about AI and coding in seconds" 
            },
          ].map((feature, i) => (
            <div
              key={i}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(8px)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '16px',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                transform: 'scale(1)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              <feature.icon style={{
                width: '48px',
                height: '48px',
                color: '#c4b5fd',
                margin: '0 auto 16px auto',
                display: 'block'
              }} />
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: 'white',
                marginBottom: '8px'
              }}>
                {feature.title}
              </h3>
              <p style={{ color: '#ddd6fe', margin: 0 }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(8px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '24px 16px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#ddd6fe', margin: 0 }}>
            Powered by AI • Created with ❤️ for poetry lovers and developers
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}