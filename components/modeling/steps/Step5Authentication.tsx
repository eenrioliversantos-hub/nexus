import React from 'react';
import { Label } from '../../ui/Label';
import { Checkbox } from '../../ui/Checkbox';
import { RadioGroup, RadioGroupItem } from '../../ui/RadioGroup';
import { Card } from '../../ui/Card';

interface Step5AuthenticationProps {
  data: {
    providers?: string[];
    sessionManagement?: string;
    passwordRecovery?: 'email' | 'sms' | 'both' | 'none';
  };
  setData: (data: any) => void;
}

const AUTH_PROVIDERS = ["E-mail e senha", "Login social (Google, Facebook, etc.)", "Autenticação de 2 fatores (2FA)", "Biometria", "SSO (Single Sign-On)", "Magic Link (login sem senha)"];

const SESSION_MANAGEMENT = [
    { value: "JWT", label: "JWT (JSON Web Tokens)", description: "Stateless tokens sent in request headers." },
    { value: "Cookies", label: "Server-side Sessions", description: "Session ID stored in a cookie, data on the server." },
];

const Step5Authentication: React.FC<Step5AuthenticationProps> = ({ data, setData }) => {
  
  const handleProviderChange = (provider: string) => {
    const currentProviders = data.providers || [];
    const newProviders = currentProviders.includes(provider)
      ? currentProviders.filter(item => item !== provider)
      : [...currentProviders, provider];
    setData({ ...data, providers: newProviders });
  };
  
  const handleSessionChange = (value: string) => {
    setData({ ...data, sessionManagement: value });
  };
  
  const handleRecoveryChange = (value: string) => {
    setData({ ...data, passwordRecovery: value });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Label>8.1 Métodos de autenticação</Label>
        <p className="text-sm text-text-secondary">Selecione os métodos que os usuários podem usar para entrar.</p>
        <div className="grid grid-cols-2 gap-4 pt-2">
            {AUTH_PROVIDERS.map(provider => (
                <div key={provider} className="flex items-center space-x-2">
                    <Checkbox
                        id={`provider-${provider}`}
                        checked={(data.providers || []).includes(provider)}
                        onChange={() => handleProviderChange(provider)}
                    />
                    <Label htmlFor={`provider-${provider}`} className="font-normal cursor-pointer">{provider}</Label>
                </div>
            ))}
        </div>
      </div>
       <div className="space-y-4">
        <Label>Gerenciamento de Sessão</Label>
        <p className="text-sm text-text-secondary">Escolha como as sessões do usuário serão tratadas após o login.</p>
         <RadioGroup
            onValueChange={handleSessionChange}
            value={data.sessionManagement}
            className="space-y-2 pt-2"
        >
          {SESSION_MANAGEMENT.map(type => (
            <Label key={type.value} htmlFor={`session-${type.value}`} className="flex flex-col p-4 border border-card-border rounded-md hover:border-accent cursor-pointer has-[:checked]:border-accent has-[:checked]:bg-accent/10 transition-colors">
                <div className="flex items-center space-x-3">
                    <RadioGroupItem value={type.value} id={`session-${type.value}`} />
                    <span className="font-semibold">{type.label}</span>
                </div>
                <p className="pl-7 text-sm text-text-secondary">{type.description}</p>
            </Label>
          ))}
        </RadioGroup>
      </div>
       <div className="space-y-4">
        <Label>8.2 Recuperação de senha</Label>
        <p className="text-sm text-text-secondary">Como os usuários poderão recuperar suas senhas?</p>
         <RadioGroup
            onValueChange={handleRecoveryChange}
            value={data.passwordRecovery}
            className="flex flex-wrap gap-x-6 gap-y-2 pt-2"
        >
            <div className="flex items-center space-x-2"><RadioGroupItem value="email" id="rec-email" /><Label htmlFor="rec-email">Por e-mail</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="sms" id="rec-sms" /><Label htmlFor="rec-sms">Por SMS</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="both" id="rec-both" /><Label htmlFor="rec-both">Ambos</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="none" id="rec-none" /><Label htmlFor="rec-none">Não haverá</Label></div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default Step5Authentication;
