import React, { useState } from 'react';
import { Heart, Share2, ExternalLink, ChevronDown } from 'lucide-react';

export default function HoldOnDad() {
  const [expandedSection, setExpandedSection] = useState('hero');
  const [shareMessage, setShareMessage] = useState('');

  const handleShare = async (text) => {
    const message = `"Hold On, Dad" – A song about why presence matters more than perfection.\n\n${text}\n\n988 (Suicide & Crisis Lifeline) | Crisis Text Line: text HOME to 741741`;
    
    if (navigator.share) {
      navigator.share({ title: 'Hold On, Dad', text: message });
    } else {
      navigator.clipboard.writeText(message);
      setShareMessage('Copied to clipboard');
      setTimeout(() => setShareMessage(''), 2000);
    }
  };

  const crisisBannerStyle = {
    backgroundColor: 'rgb(127, 29, 29)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgb(185, 28, 28)',
    padding: '12px 16px',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  };

  const containerStyle = {
    maxWidth: '768px',
    margin: '0 auto',
    padding: '0 16px',
    backgroundColor: 'rgb(15, 23, 42)',
    minHeight: '100vh',
    color: 'rgb(226, 232, 240)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  };

  const sectionStyle = {
    paddingTop: '48px',
    paddingBottom: '48px',
    borderTopColor: 'rgb(51, 65, 85)',
    borderTopWidth: '1px',
  };

  const headingStyle = {
    fontSize: '48px',
    fontWeight: 'bold',
    lineHeight: '1.2',
    letterSpacing: '-0.02em',
    marginBottom: '24px',
  };

  const subheadingStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '24px',
  };

  const paragraphStyle = {
    fontSize: '16px',
    color: 'rgb(203, 213, 225)',
    lineHeight: '1.75',
    marginBottom: '16px',
  };

  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '8px',
    backgroundColor: 'rgb(180, 83, 9)',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '14px',
    transition: 'background-color 0.2s',
  };

  const expandableBoxStyle = {
    width: '100%',
    textAlign: 'left',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid rgb(71, 85, 105)',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  const expandableBoxHoverStyle = {
    ...expandableBoxStyle,
    borderColor: 'rgb(100, 116, 139)',
    backgroundColor: 'rgba(71, 85, 105, 0.2)',
  };

  const resourceBoxStyle = {
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    border: '1px solid rgb(71, 85, 105)',
    borderRadius: '8px',
    padding: '32px',
    marginTop: '48px',
  };

  const resourceItemStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: 'rgba(51, 65, 85, 0.5)',
    marginBottom: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    textDecoration: 'none',
    color: 'inherit',
  };

  return (
    <div style={containerStyle}>
      {/* Crisis Banner */}
      <div style={crisisBannerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', fontSize: '14px' }}>
          <span style={{ fontWeight: '500' }}>If you're in crisis right now:</span>
          <div style={{ display: 'flex', gap: '12px' }}>
            <a href="tel:988" style={{ fontWeight: 'bold', color: 'rgb(229, 231, 235)', textDecoration: 'none' }}>
              Call 988
            </a>
            <span style={{ color: 'rgb(153, 27, 27)' }}>•</span>
            <a href="sms:741741?body=HOME" style={{ fontWeight: 'bold', color: 'rgb(229, 231, 235)', textDecoration: 'none' }}>
              Text HOME to 741741
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ paddingTop: '64px', paddingBottom: '16px' }}>
        
        {/* Hero Section */}
        <section style={{ ...sectionStyle, borderTopWidth: '0', paddingTop: '0' }}>
          <div style={{ marginBottom: '24px' }}>
            <h1 style={headingStyle}>Hold On, Dad</h1>
            <p style={{ fontSize: '20px', color: 'rgb(148, 163, 184)', lineHeight: '1.6' }}>
              A letter from the future. A child, grown, writes back to a parent drowning in shame—telling him what he couldn't hear in the darkness: <span style={{ color: 'rgb(252, 191, 73)', fontWeight: '500' }}>your presence was never a burden. Your survival was the promise I needed.</span>
            </p>
          </div>

          {/* Expandable Song Description */}
          <button
            onClick={() => setExpandedSection(expandedSection === 'description' ? 'hero' : 'description')}
            onMouseEnter={(e) => Object.assign(e.target.style, expandableBoxHoverStyle)}
            onMouseLeave={(e) => Object.assign(e.target.style, expandableBoxStyle)}
            style={expandableBoxStyle}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
              <span style={{ fontWeight: '600', color: 'rgb(252, 191, 73)' }}>What This Song Is About</span>
              <ChevronDown style={{ width: '20px', height: '20px', marginTop: '4px', transition: 'transform 0.2s', transform: expandedSection === 'description' ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </div>
            {expandedSection === 'description' && (
              <div style={{ marginTop: '16px', color: 'rgb(148, 163, 184)', lineHeight: '1.75' }}>
                <p style={{ marginBottom: '16px' }}>
                  This song cuts through the isolation of depression by asking the hardest question: "What if the person you think you're sparing is actually waiting for you?"
                </p>
                <p style={{ marginBottom: '16px' }}>
                  It challenges the lie that perfection, sobriety, or conquest is the price of love. Instead, it offers something quieter and fiercer—that showing up broken, making mistakes, breathing through the chaos is <span style={{ fontStyle: 'italic' }}>exactly</span> what mattered.
                </p>
                <div style={{ paddingTop: '16px', borderTopColor: 'rgb(71, 85, 105)', borderTopWidth: '1px', marginTop: '16px' }}>
                  <p style={{ fontWeight: '600', color: 'rgb(203, 213, 225)', marginBottom: '12px' }}>For anyone who's:</p>
                  <ul style={{ margin: '0', paddingLeft: '0', color: 'rgb(100, 116, 139)', fontSize: '14px' }}>
                    <li style={{ marginBottom: '8px', display: 'flex', gap: '12px' }}><span style={{ color: 'rgb(252, 191, 73)' }}>•</span> Felt like a burden to the people they love</li>
                    <li style={{ marginBottom: '8px', display: 'flex', gap: '12px' }}><span style={{ color: 'rgb(252, 191, 73)' }}>•</span> Believed that leaving would somehow ease the pain for others</li>
                    <li style={{ marginBottom: '8px', display: 'flex', gap: '12px' }}><span style={{ color: 'rgb(252, 191, 73)' }}>•</span> Struggled with shame that whispers you're not enough</li>
                    <li style={{ display: 'flex', gap: '12px' }}><span style={{ color: 'rgb(252, 191, 73)' }}>•</span> Wondered if survival was worth it</li>
                  </ul>
                </div>
              </div>
            )}
          </button>

          <button
            onClick={() => handleShare('This song speaks to the isolation of depression—and reminds us that presence, broken and trying, is enough.')}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgb(217, 119, 6)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgb(180, 83, 9)'}
            style={buttonStyle}
          >
            <Share2 style={{ width: '16px', height: '16px' }} />
            Share This Song
          </button>
          {shareMessage && <p style={{ fontSize: '14px', color: 'rgb(74, 222, 128)', marginTop: '12px' }}>{shareMessage}</p>}
        </section>

        {/* Why This Matters */}
        <section style={sectionStyle}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={subheadingStyle}>Why This Matters to Me</h2>
            <p style={{ color: 'rgb(100, 116, 139)', fontStyle: 'italic', marginBottom: '0' }}>— From me to you</p>
          </div>

          <div style={{ color: 'rgb(148, 163, 184)', lineHeight: '1.75' }}>
            <p style={paragraphStyle}>
              I wrote this because I know what it feels like when the voice in your head gets so loud that leaving seems like the kindest thing you could do—and I need you to know that <span style={{ color: 'rgb(252, 191, 73)', fontWeight: '600' }}>that voice is lying.</span>
            </p>

            <p style={paragraphStyle}>
              I'm a father, an engineer, someone who builds things for other people to trust. For the longest time, I couldn't apply that same care to myself. I thought I had to be perfect to deserve the people I love—until my daughter showed me that my broken, trying, real self was exactly what she needed.
            </p>

            <p style={paragraphStyle}>
              If you're reading this and you believe everyone would be better off without you, I'm telling you directly: <span style={{ color: 'rgb(252, 191, 73)', fontWeight: '600' }}>you're wrong.</span> And there's someone—maybe someone you don't even know about yet—whose entire future depends on you staying.
            </p>

            <p style={paragraphStyle}>
              I'm putting this out because shame dies in silence. Your presence isn't a burden; it's a promise. And showing up at all is everything.
            </p>
          </div>

          <button
            onClick={() => handleShare('If you're in the dark right now, know this: your presence matters. Shame dies in silence. Call 988 or text HOME to 741741.')}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgb(217, 119, 6)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgb(180, 83, 9)'}
            style={{ ...buttonStyle, marginTop: '24px' }}
          >
            <Share2 style={{ width: '16px', height: '16px' }} />
            Share This Message
          </button>
        </section>

        {/* Resources */}
        <section style={resourceBoxStyle}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>You're Not Alone</h2>
          
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontWeight: '600', color: 'rgb(252, 191, 73)', marginBottom: '12px' }}>In Immediate Crisis</h3>
              <p style={{ color: 'rgb(100, 116, 139)', fontSize: '14px', marginBottom: '12px' }}>Call or text anytime, 24/7. Free. Confidential.</p>
              <div>
                <a
                  href="tel:988"
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(51, 65, 85, 0.8)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(51, 65, 85, 0.5)'}
                  style={resourceItemStyle}
                >
                  <span style={{ fontWeight: '600' }}>Suicide & Crisis Lifeline</span>
                  <ExternalLink style={{ width: '16px', height: '16px', opacity: '0.5' }} />
                </a>
                <a
                  href="sms:741741?body=HOME"
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(51, 65, 85, 0.8)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(51, 65, 85, 0.5)'}
                  style={resourceItemStyle}
                >
                  <span style={{ fontWeight: '600' }}>Crisis Text Line (text HOME to 741741)</span>
                  <ExternalLink style={{ width: '16px', height: '16px', opacity: '0.5' }} />
                </a>
              </div>
            </div>

            <div style={{ paddingTop: '16px', borderTopColor: 'rgb(71, 85, 105)', borderTopWidth: '1px', marginBottom: '24px' }}>
              <h3 style={{ fontWeight: '600', color: 'rgb(252, 191, 73)', marginBottom: '12px', marginTop: '16px' }}>Other Languages & Populations</h3>
              <a
                href="https://www.iasp.info/resources/Crisis_Centres/"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(51, 65, 85, 0.8)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(51, 65, 85, 0.5)'}
                style={resourceItemStyle}
              >
                <span style={{ fontWeight: '600' }}>International Association for Suicide Prevention</span>
                <ExternalLink style={{ width: '16px', height: '16px', opacity: '0.5' }} />
              </a>
            </div>

            <div style={{ paddingTop: '16px', borderTopColor: 'rgb(71, 85, 105)', borderTopWidth: '1px' }}>
              <h3 style={{ fontWeight: '600', color: 'rgb(252, 191, 73)', marginBottom: '12px', marginTop: '16px' }}>What to Expect</h3>
              <p style={{ color: 'rgb(100, 116, 139)', fontSize: '14px', margin: '0' }}>
                You'll talk to a real person. No judgment. No pressure to "be okay." Just someone who understands what it's like when the weight gets too heavy.
              </p>
            </div>
          </div>
        </section>

        {/* Closing */}
        <section style={sectionStyle}>
          <p style={{ ...paragraphStyle, fontSize: '18px' }}>
            If you're in the dark right now—not for me, but for the person waiting for you in the future—reach out.
          </p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Heart style={{ width: '20px', height: '20px', color: 'rgb(239, 68, 68)', fill: 'rgb(239, 68, 68)' }} />
            <span style={{ color: 'rgb(100, 116, 139)' }}>You're worth staying for.</span>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ borderTopColor: 'rgb(71, 85, 105)', borderTopWidth: '1px', paddingTop: '32px', paddingBottom: '16px' }}>
          <p style={{ fontSize: '14px', color: 'rgb(71, 85, 105)', textAlign: 'center', margin: '0', lineHeight: '1.6' }}>
            "Hold On, Dad" was written from lived experience. <br />
            If this song resonates, please share it. Someone needs to hear it.
          </p>
        </footer>
      </div>
    </div>
  );
}
