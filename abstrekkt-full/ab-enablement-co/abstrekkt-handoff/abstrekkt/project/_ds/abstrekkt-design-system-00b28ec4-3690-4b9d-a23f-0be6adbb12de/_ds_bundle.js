/* @ds-bundle: {"format":4,"namespace":"AbstrekktDesignSystem_00b28e","components":[{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"IconButton","sourcePath":"components/actions/IconButton.jsx"},{"name":"Badge","sourcePath":"components/data-display/Badge.jsx"},{"name":"Callout","sourcePath":"components/feedback/Callout.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Card","sourcePath":"components/surfaces/Card.jsx"},{"name":"Rule","sourcePath":"components/surfaces/Rule.jsx"},{"name":"Display","sourcePath":"components/typography/Display.jsx"},{"name":"Kicker","sourcePath":"components/typography/Kicker.jsx"}],"sourceHashes":{"components/actions/Button.jsx":"fb070b2fa10b","components/actions/IconButton.jsx":"cda06f3e3055","components/data-display/Badge.jsx":"99aec1921e3a","components/feedback/Callout.jsx":"cca57c482550","components/forms/Input.jsx":"e037e735bce2","components/surfaces/Card.jsx":"770c8c79eccb","components/surfaces/Rule.jsx":"687554822dc9","components/typography/Display.jsx":"88254bc6ef92","components/typography/Kicker.jsx":"4c0b412207cd","ui_kits/studio/ContactPanel.jsx":"5542be395231","ui_kits/studio/Footer.jsx":"cfdd5f40c144","ui_kits/studio/Header.jsx":"226980c9019e","ui_kits/studio/Hero.jsx":"3eb30acf884a","ui_kits/studio/ProductLanes.jsx":"7095658f0432","ui_kits/studio/WorkIndex.jsx":"e126b2375f70"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.AbstrekktDesignSystem_00b28e = window.AbstrekktDesignSystem_00b28e || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/actions/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Abstrekkt Button — editorial, restrained. Brass primary, hairline secondary,
 * quiet ghost. Small radii, mono-ish confidence. No gradients, no glow.
 */
function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  as = 'button',
  href,
  onClick,
  style,
  children,
  ...rest
}) {
  const sizes = {
    sm: {
      padding: '7px 14px',
      fontSize: 12,
      letterSpacing: '0.16em'
    },
    md: {
      padding: '10px 20px',
      fontSize: 13,
      letterSpacing: '0.16em'
    },
    lg: {
      padding: '14px 28px',
      fontSize: 14,
      letterSpacing: '0.14em'
    }
  };
  const variants = {
    primary: {
      background: 'var(--brass)',
      color: 'var(--ink-950)',
      border: '1px solid var(--brass)'
    },
    secondary: {
      background: 'transparent',
      color: 'var(--fg-1)',
      border: '1px solid var(--border-2)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--brass)',
      border: '1px solid transparent'
    }
  };
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    fontFamily: 'var(--font-mono)',
    fontWeight: 500,
    textTransform: 'uppercase',
    textDecoration: 'none',
    borderRadius: 'var(--radius-md)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    transition: 'background var(--dur-fast) var(--ease-standard), color var(--dur-fast) var(--ease-standard), border-color var(--dur-fast) var(--ease-standard), transform var(--dur-fast) var(--ease-standard)',
    whiteSpace: 'nowrap',
    ...sizes[size],
    ...variants[variant],
    ...style
  };
  const hoverStyles = {
    primary: {
      background: 'var(--brass-soft)',
      borderColor: 'var(--brass-soft)'
    },
    secondary: {
      borderColor: 'var(--brass)',
      color: 'var(--brass)'
    },
    ghost: {
      color: 'var(--brass-soft)',
      background: 'var(--brass-wash)'
    }
  };
  const handleEnter = e => {
    if (disabled) return;
    Object.assign(e.currentTarget.style, hoverStyles[variant]);
  };
  const handleLeave = e => {
    if (disabled) return;
    Object.assign(e.currentTarget.style, variants[variant]);
  };
  const handleDown = e => {
    if (!disabled) e.currentTarget.style.transform = 'translateY(1px)';
  };
  const handleUp = e => {
    if (!disabled) e.currentTarget.style.transform = 'translateY(0)';
  };
  const Tag = as === 'a' ? 'a' : 'button';
  const tagProps = as === 'a' ? {
    href
  } : {
    type,
    disabled
  };
  return /*#__PURE__*/React.createElement(Tag, _extends({}, tagProps, {
    onClick: disabled ? undefined : onClick,
    onMouseEnter: handleEnter,
    onMouseLeave: handleLeave,
    onMouseDown: handleDown,
    onMouseUp: handleUp,
    style: base
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Button.jsx", error: String((e && e.message) || e) }); }

// components/actions/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Abstrekkt IconButton — a square, quiet control for a single glyph.
 * Pass an icon node (e.g. an <svg> or lucide element) as children.
 */
function IconButton({
  size = 'md',
  variant = 'ghost',
  disabled = false,
  label,
  onClick,
  style,
  children,
  ...rest
}) {
  const dims = {
    sm: 30,
    md: 38,
    lg: 46
  };
  const d = dims[size];
  const variants = {
    ghost: {
      background: 'transparent',
      border: '1px solid transparent',
      color: 'var(--fg-dim)'
    },
    outline: {
      background: 'transparent',
      border: '1px solid var(--border-2)',
      color: 'var(--fg-1)'
    },
    solid: {
      background: 'var(--surface-2)',
      border: '1px solid var(--border-1)',
      color: 'var(--fg-1)'
    }
  };
  const base = {
    width: d,
    height: d,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--radius-md)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    transition: 'background var(--dur-fast) var(--ease-standard), color var(--dur-fast) var(--ease-standard), border-color var(--dur-fast) var(--ease-standard)',
    ...variants[variant],
    ...style
  };
  const onEnter = e => {
    if (disabled) return;
    e.currentTarget.style.background = 'var(--brass-wash)';
    e.currentTarget.style.color = 'var(--brass)';
  };
  const onLeave = e => {
    if (disabled) return;
    Object.assign(e.currentTarget.style, variants[variant]);
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    disabled: disabled,
    onClick: disabled ? undefined : onClick,
    onMouseEnter: onEnter,
    onMouseLeave: onLeave,
    style: base
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Abstrekkt Badge — a small mono label chip. Brass-wash by default; forest and
 * neutral tones for sub-brand lanes. Uppercase, wide tracking.
 */
function Badge({
  tone = 'brass',
  style,
  children,
  ...rest
}) {
  const tones = {
    brass: {
      color: 'var(--brass)',
      background: 'var(--brass-wash)',
      border: '1px solid rgba(200,168,106,0.25)'
    },
    neutral: {
      color: 'var(--fg-dim)',
      background: 'var(--surface-2)',
      border: '1px solid var(--border-1)'
    },
    forest: {
      color: '#8fb98a',
      background: 'rgba(27,43,26,0.6)',
      border: '1px solid rgba(143,185,138,0.25)'
    },
    solid: {
      color: 'var(--ink-950)',
      background: 'var(--brass)',
      border: '1px solid var(--brass)'
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-mono)',
      fontSize: 9,
      fontWeight: 500,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      padding: '4px 9px',
      borderRadius: 'var(--radius-sm)',
      ...tones[tone],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Callout.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Abstrekkt Callout — a marginalia note / aside. Left brass rail, warm wash,
 * a mono label and serif body. For asides, warnings, editor's notes.
 */
function Callout({
  label = 'Note',
  tone = 'brass',
  style,
  children,
  ...rest
}) {
  const tones = {
    brass: {
      rail: 'var(--brass)',
      label: 'var(--brass)',
      wash: 'var(--brass-wash)'
    },
    forest: {
      rail: '#8fb98a',
      label: '#8fb98a',
      wash: 'rgba(27,43,26,0.5)'
    },
    neutral: {
      rail: 'var(--border-2)',
      label: 'var(--fg-dim)',
      wash: 'var(--surface-2)'
    }
  };
  const t = tones[tone] || tones.brass;
  return /*#__PURE__*/React.createElement("aside", _extends({
    style: {
      borderLeft: `2px solid ${t.rail}`,
      background: t.wash,
      padding: '16px 20px',
      borderRadius: '0 var(--radius-md) var(--radius-md) 0',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 9,
      fontWeight: 500,
      letterSpacing: '0.24em',
      textTransform: 'uppercase',
      color: t.label,
      marginBottom: 8
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      lineHeight: 1.6,
      color: 'var(--fg-1)'
    }
  }, children));
}
Object.assign(__ds_scope, { Callout });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Callout.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Abstrekkt Input — a text field pressed into the page. Warm well surface,
 * hairline border, brass focus ring. Optional mono label above.
 */
function Input({
  label,
  hint,
  id,
  style,
  wrapperStyle,
  ...rest
}) {
  const [focused, setFocused] = React.useState(false);
  const inputId = id || (label ? `abs-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 7,
      ...wrapperStyle
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 9,
      fontWeight: 500,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: 'var(--fg-dim)'
    }
  }, label), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    onFocus: e => {
      setFocused(true);
      rest.onFocus && rest.onFocus(e);
    },
    onBlur: e => {
      setFocused(false);
      rest.onBlur && rest.onBlur(e);
    },
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      lineHeight: 1.4,
      color: 'var(--fg-1)',
      background: 'var(--surface-2)',
      border: `1px solid ${focused ? 'var(--brass)' : 'var(--border-1)'}`,
      borderRadius: 'var(--radius-md)',
      padding: '10px 13px',
      outline: 'none',
      boxShadow: focused ? '0 0 0 3px var(--focus-ring)' : 'var(--inset-well)',
      transition: 'border-color var(--dur-fast) var(--ease-standard), box-shadow var(--dur-fast) var(--ease-standard)',
      ...style
    }
  }, rest)), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: 'var(--fg-mute)'
    }
  }, hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Abstrekkt Card — a raised surface panel with a hairline border. The quiet
 * container for editorial content. Optional accent rail on the left edge.
 */
function Card({
  accent = false,
  padding = 'lg',
  hover = false,
  style,
  children,
  ...rest
}) {
  const pads = {
    none: 0,
    sm: 16,
    md: 24,
    lg: 32
  };
  const base = {
    background: 'var(--surface-1)',
    border: '1px solid var(--border-1)',
    borderRadius: 'var(--radius-lg)',
    padding: pads[padding],
    boxShadow: 'var(--shadow-1)',
    position: 'relative',
    transition: 'border-color var(--dur-med) var(--ease-standard), transform var(--dur-med) var(--ease-out)',
    ...(accent ? {
      borderLeft: '2px solid var(--brass)'
    } : null),
    ...style
  };
  const onEnter = e => {
    if (!hover) return;
    e.currentTarget.style.borderColor = 'var(--border-2)';
    e.currentTarget.style.transform = 'translateY(-2px)';
  };
  const onLeave = e => {
    if (!hover) return;
    e.currentTarget.style.borderColor = accent ? 'var(--border-1)' : 'var(--border-1)';
    e.currentTarget.style.transform = 'translateY(0)';
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: base,
    onMouseEnter: onEnter,
    onMouseLeave: onLeave
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Card.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Rule.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Abstrekkt Rule — an editorial divider. Warm hairline, optionally with a
 * centered or leading brass tick / label, like a chapter break.
 */
function Rule({
  label,
  align = 'center',
  style,
  ...rest
}) {
  const line = {
    flex: 1,
    height: 1,
    background: 'var(--rule)'
  };
  if (!label) {
    return /*#__PURE__*/React.createElement("hr", _extends({
      style: {
        border: 0,
        height: 1,
        background: 'var(--rule)',
        margin: 0,
        ...style
      }
    }, rest));
  }
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      ...style
    }
  }, rest), align !== 'start' && /*#__PURE__*/React.createElement("div", {
    style: line
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 9,
      fontWeight: 500,
      letterSpacing: '0.24em',
      textTransform: 'uppercase',
      color: 'var(--brass)',
      whiteSpace: 'nowrap'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: line
  }));
}
Object.assign(__ds_scope, { Rule });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Rule.jsx", error: String((e && e.message) || e) }); }

// components/typography/Display.jsx
try { (() => {
/**
 * Abstrekkt Display — Fraunces display heading at optical size 144, tight
 * leading and tracking. Wrap an emphasized word in <em> to render it in
 * brass italic, the house emphasis treatment.
 */
function Display({
  level = 1,
  size = 'lg',
  style,
  children,
  ...rest
}) {
  const sizes = {
    xxl: 96,
    xl: 72,
    lg: 56,
    md: 40,
    sm: 30
  };
  const Tag = `h${level}`;
  return React.createElement(Tag, {
    style: {
      fontFamily: 'var(--font-display)',
      fontOpticalSizing: 'auto',
      fontVariationSettings: '"opsz" 144',
      fontWeight: 400,
      fontSize: sizes[size] || sizes.lg,
      lineHeight: 1.0,
      letterSpacing: '-0.02em',
      color: 'var(--fg-1)',
      margin: 0,
      textWrap: 'balance',
      ...style
    },
    ...rest
  }, children);
}
Object.assign(__ds_scope, { Display });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/typography/Display.jsx", error: String((e && e.message) || e) }); }

// components/typography/Kicker.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Abstrekkt Kicker — the mono eyebrow label. Uppercase JetBrains Mono,
 * wide tracking, brass by default. The signature editorial meta-mark.
 */
function Kicker({
  color = 'brass',
  as = 'div',
  style,
  children,
  ...rest
}) {
  const colors = {
    brass: 'var(--brass)',
    dim: 'var(--fg-dim)',
    mute: 'var(--fg-mute)',
    fg: 'var(--fg-1)'
  };
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    style: {
      fontFamily: 'var(--font-mono)',
      fontWeight: 500,
      fontSize: 10,
      lineHeight: 1,
      textTransform: 'uppercase',
      letterSpacing: '0.24em',
      color: colors[color] || colors.brass,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Kicker });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/typography/Kicker.jsx", error: String((e && e.message) || e) }); }

// ui_kits/studio/ContactPanel.jsx
try { (() => {
/* global React */
const {
  Kicker,
  Display,
  Input,
  Button,
  Callout,
  Card
} = window.AbstrekktDesignSystem_00b28e;
function ContactPanel() {
  const [sent, setSent] = React.useState(false);
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '112px 48px 120px',
      maxWidth: 720,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Kicker, {
    style: {
      marginBottom: 24
    }
  }, "Enquire \u2014 we reply within a day"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontVariationSettings: '"opsz" 144',
      fontWeight: 400,
      fontSize: 52,
      letterSpacing: '-0.02em',
      color: 'var(--fg-1)',
      margin: '0 0 20px'
    }
  }, "Tell us what needs to ", /*#__PURE__*/React.createElement("em", {
    style: {
      fontStyle: 'italic',
      color: 'var(--brass)'
    }
  }, "hold"), "."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 17,
      lineHeight: 1.6,
      color: 'var(--fg-dim)',
      marginBottom: 40
    }
  }, "A sentence or two is enough to start. We read everything ourselves."), sent ? /*#__PURE__*/React.createElement(Callout, {
    label: "Received",
    tone: "brass"
  }, "Thank you \u2014 your note is in the reading room. We\u2019ll be in touch shortly.") : /*#__PURE__*/React.createElement(Card, {
    padding: "lg"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Name",
    placeholder: "Ada Lovelace"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Email",
    placeholder: "you@studio.com"
  })), /*#__PURE__*/React.createElement(Input, {
    label: "What are you building?",
    placeholder: "A short line about the work\u2026"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "md",
    onClick: () => setSent(true)
  }, "Send enquiry")))));
}
window.AbsContactPanel = ContactPanel;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/studio/ContactPanel.jsx", error: String((e && e.message) || e) }); }

// ui_kits/studio/Footer.jsx
try { (() => {
/* global React */
const {
  Rule
} = window.AbstrekktDesignSystem_00b28e;
function Footer() {
  const cols = [{
    h: 'Studio',
    items: ['About', 'Practices', 'Field Notes']
  }, {
    h: 'Lanes',
    items: ['Load-Bearing', 'Products', 'Enablement']
  }, {
    h: 'Contact',
    items: ['Enquire', 'hello@abstrekkt.com']
  }];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      borderTop: '1px solid var(--border-1)',
      background: 'var(--ink-950)',
      padding: '56px 48px 40px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1100,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr 1fr',
      gap: 40
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontVariationSettings: '"opsz" 144',
      fontWeight: 500,
      fontSize: 22,
      letterSpacing: '-0.02em',
      color: 'var(--fg-1)'
    }
  }, "Abstrekkt", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--brass)'
    }
  }, ".")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      lineHeight: 1.6,
      color: 'var(--fg-mute)',
      maxWidth: '34ch',
      marginTop: 12
    }
  }, "A parent studio for AI enablement and the software it produces. Kept like a private library.")), cols.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.h
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 9,
      fontWeight: 500,
      letterSpacing: '0.24em',
      textTransform: 'uppercase',
      color: 'var(--fg-dim)',
      marginBottom: 16
    }
  }, c.h), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, c.items.map(it => /*#__PURE__*/React.createElement("a", {
    key: it,
    href: "#",
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      color: 'var(--fg-1)',
      textDecoration: 'none'
    },
    onMouseEnter: e => e.currentTarget.style.color = 'var(--brass)',
    onMouseLeave: e => e.currentTarget.style.color = 'var(--fg-1)'
  }, it)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1100,
      margin: '40px auto 0'
    }
  }, /*#__PURE__*/React.createElement(Rule, null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: 20,
      fontFamily: 'var(--font-mono)',
      fontSize: 9,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'var(--fg-mute)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Abstrekkt"), /*#__PURE__*/React.createElement("span", null, "Reading Room at Midnight"))));
}
window.AbsFooter = Footer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/studio/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/studio/Header.jsx
try { (() => {
/* global React */
const {
  Kicker,
  Button,
  IconButton
} = window.AbstrekktDesignSystem_00b28e;
function Logo() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontVariationSettings: '"opsz" 144',
      fontWeight: 500,
      fontSize: 22,
      letterSpacing: '-0.02em',
      color: 'var(--fg-1)'
    }
  }, "Abstrekkt", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--brass)'
    }
  }, "."));
}
function Header({
  route,
  onNavigate
}) {
  const links = [{
    id: 'home',
    label: 'Studio'
  }, {
    id: 'work',
    label: 'Work'
  }, {
    id: 'contact',
    label: 'Enquire'
  }];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px 48px',
      background: 'rgba(13,12,10,0.72)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 40,
      cursor: 'pointer'
    },
    onClick: () => onNavigate('home')
  }, /*#__PURE__*/React.createElement(Logo, null)), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 28
    }
  }, links.map(l => /*#__PURE__*/React.createElement("button", {
    key: l.id,
    onClick: () => onNavigate(l.id),
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      fontWeight: 500,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: route === l.id ? 'var(--brass)' : 'var(--fg-dim)',
      transition: 'color 140ms'
    },
    onMouseEnter: e => {
      if (route !== l.id) e.currentTarget.style.color = 'var(--fg-1)';
    },
    onMouseLeave: e => {
      if (route !== l.id) e.currentTarget.style.color = 'var(--fg-dim)';
    }
  }, l.label)), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: () => onNavigate('contact')
  }, "Start a project")));
}
window.AbsHeader = Header;
window.AbsLogo = Logo;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/studio/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/studio/Hero.jsx
try { (() => {
/* global React */
const {
  Kicker,
  Display,
  Button,
  Rule
} = window.AbstrekktDesignSystem_00b28e;
function Hero({
  onNavigate
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      padding: '120px 48px 96px',
      maxWidth: 1100,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Kicker, {
    style: {
      marginBottom: 28
    }
  }, "Parent Studio \u2014 AI Enablement & Software"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontVariationSettings: '"opsz" 144',
      fontWeight: 400,
      fontSize: 84,
      lineHeight: 0.98,
      letterSpacing: '-0.025em',
      color: 'var(--fg-1)',
      margin: 0,
      maxWidth: 15 + 'ch',
      textWrap: 'balance'
    }
  }, "A studio for work that ", /*#__PURE__*/React.createElement("em", {
    style: {
      fontStyle: 'italic',
      color: 'var(--brass)'
    }
  }, "bears weight"), "."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 19,
      lineHeight: 1.6,
      color: 'var(--fg-dim)',
      maxWidth: '54ch',
      marginTop: 32
    }
  }, "We build the enablement practices and the software beneath them \u2014 quiet, durable systems for teams putting AI to serious use. No dashboards for their own sake. No noise."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      marginTop: 40
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    onClick: () => onNavigate('work')
  }, "See the work"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg",
    onClick: () => onNavigate('contact')
  }, "Enquire")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 80
    }
  }, /*#__PURE__*/React.createElement(Rule, {
    label: "Practices"
  })));
}
window.AbsHero = Hero;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/studio/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/studio/ProductLanes.jsx
try { (() => {
/* global React */
const {
  Card,
  Kicker,
  Badge,
  Button
} = window.AbstrekktDesignSystem_00b28e;
const LANES = [{
  name: 'Load-Bearing',
  tone: 'forest',
  tag: 'Sub-brand',
  accent: '#8fb98a',
  surface: 'rgba(27,43,26,0.45)',
  desc: 'Structural AI for the systems that have to hold — evaluation, governance, and the enablement scaffolding underneath.'
}, {
  name: 'Abstrekkt Products',
  tone: 'brass',
  tag: 'Software lane',
  accent: 'var(--brass)',
  surface: 'var(--surface-1)',
  desc: 'Shipping software built in-house. Focused tools, released quietly and maintained like a library collection.'
}, {
  name: 'Enablement Practice',
  tone: 'neutral',
  tag: 'Services',
  accent: 'var(--fg-dim)',
  surface: 'var(--surface-1)',
  desc: 'Embedded engagements: we teach teams to build with AI the way we do, then leave the practice behind us.'
}];
function ProductLanes() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '24px 48px 96px',
      maxWidth: 1100,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 20
    }
  }, LANES.map(l => /*#__PURE__*/React.createElement(Card, {
    key: l.name,
    hover: true,
    padding: "lg",
    style: {
      background: l.surface,
      borderLeft: `2px solid ${l.accent}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: l.tone
  }, l.tag), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      color: 'var(--fg-mute)'
    }
  }, "0", LANES.indexOf(l) + 1)), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontVariationSettings: '"opsz" 144',
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: '-0.01em',
      color: 'var(--fg-1)',
      margin: '0 0 12px'
    }
  }, l.name), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      lineHeight: 1.6,
      color: 'var(--fg-dim)',
      margin: 0
    }
  }, l.desc)))));
}
window.AbsProductLanes = ProductLanes;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/studio/ProductLanes.jsx", error: String((e && e.message) || e) }); }

// ui_kits/studio/WorkIndex.jsx
try { (() => {
/* global React */
const {
  Kicker,
  Rule,
  Badge
} = window.AbstrekktDesignSystem_00b28e;
const ENTRIES = [{
  yr: '2026',
  title: 'Governance for a model-heavy stack',
  client: 'Load-Bearing',
  tone: 'forest'
}, {
  yr: '2025',
  title: 'An evaluation harness, released as open source',
  client: 'Products',
  tone: 'brass'
}, {
  yr: '2025',
  title: 'Enablement residency — six weeks, one team',
  client: 'Practice',
  tone: 'neutral'
}, {
  yr: '2024',
  title: 'The reading-room internal knowledge base',
  client: 'Studio',
  tone: 'brass'
}];
function WorkIndex() {
  const [hover, setHover] = React.useState(-1);
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '112px 48px 96px',
      maxWidth: 1000,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Kicker, {
    style: {
      marginBottom: 24
    }
  }, "Selected Work \u2014 an index"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontVariationSettings: '"opsz" 144',
      fontWeight: 400,
      fontSize: 56,
      letterSpacing: '-0.02em',
      color: 'var(--fg-1)',
      margin: '0 0 48px'
    }
  }, "Things we ", /*#__PURE__*/React.createElement("em", {
    style: {
      fontStyle: 'italic',
      color: 'var(--brass)'
    }
  }, "kept"), "."), /*#__PURE__*/React.createElement("div", null, ENTRIES.map((e, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    onMouseEnter: () => setHover(i),
    onMouseLeave: () => setHover(-1),
    style: {
      display: 'grid',
      gridTemplateColumns: '80px 1fr auto',
      alignItems: 'center',
      gap: 24,
      padding: '24px 8px',
      borderTop: '1px solid var(--rule)',
      cursor: 'pointer',
      transition: 'padding-left 200ms var(--ease-out)',
      paddingLeft: hover === i ? 20 : 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.1em',
      color: 'var(--fg-mute)'
    }
  }, e.yr), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontVariationSettings: '"opsz" 144',
      fontSize: 24,
      fontWeight: 400,
      color: hover === i ? 'var(--brass-soft)' : 'var(--fg-1)',
      transition: 'color 200ms'
    }
  }, e.title), /*#__PURE__*/React.createElement(Badge, {
    tone: e.tone
  }, e.client))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--rule)'
    }
  })));
}
window.AbsWorkIndex = WorkIndex;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/studio/WorkIndex.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Callout = __ds_scope.Callout;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Rule = __ds_scope.Rule;

__ds_ns.Display = __ds_scope.Display;

__ds_ns.Kicker = __ds_scope.Kicker;

})();
