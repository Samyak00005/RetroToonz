export default function SocialLoginButton({ provider, iconSrc, disabled = true }) {
  return (
    <button
      type="button"
      disabled={disabled}
      title={disabled ? `${provider} sign-in will be connected later` : undefined}
      className="rt-auth-social"
    >
      <img src={iconSrc} alt="" className="h-5 w-5 object-contain" />
      Continue with {provider}
      {disabled && <span className="ml-auto text-[10px] text-white/30">Later</span>}
    </button>
  );
}
