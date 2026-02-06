import { AppSdk } from '@/src/utils/AppSdk';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export type CountryOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

export type CountryApiResponse = {
  name: {
    common: string;
  };
  idd?: {
    root?: string;
    suffixes?: string[];
  };
  flags?: {
    png?: string;
    svg?: string;
  };
};

export type PhoneCodeOption = {
  label: string;
  value: string;
  disabled?: boolean;
  country: string;
  flag: string;
};

export function useCountries() {
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [countryPhoneCodes, setCountryPhoneCodes] = useState<PhoneCodeOption[]>(
    [],
  );

  const fetchCountries = async () => {
    try {
      const res = await AppSdk.getData(
        'https://restcountries.com/v3.1/all?fields=name,idd,flags',
        null,
      );

      const countryOptions: CountryOption[] = [];
      const phoneOptions: PhoneCodeOption[] = [];

      res.forEach((country: CountryApiResponse) => {
        const name = country.name.common;

        countryOptions.push({
          label: name,
          value: name,
        });

        if (country.idd?.root && country.idd?.suffixes?.length) {
          phoneOptions.push({
            label: `${country.idd.root}${country.idd.suffixes[0]} (${name})`,
            value: `${country.idd.root}${country.idd.suffixes[0]}`,
            country: name,
            flag: country.flags?.png || '',
          });
        }
      });

      countryOptions.sort((a, b) => a.label.localeCompare(b.label));
      phoneOptions.sort((a, b) => a.country.localeCompare(b.country));

      setCountries(countryOptions);
      setCountryPhoneCodes(phoneOptions);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load countries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (countries.length === 0) fetchCountries();
  }, []);

  return { countries, loading, countryPhoneCodes };
}
