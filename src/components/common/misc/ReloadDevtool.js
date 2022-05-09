import { useRouter } from 'next/router';
import * as React from 'react';
import { HiRefresh } from 'react-icons/hi';
import { isProd } from '../../../constants/env';
import ButtonLink from '../links/ButtonLink';

export default function ReloadDevtool() {
  const router = useRouter();

  return !isProd ? (
    <ButtonLink href={router.asPath} className="fixed bottom-4 left-4">
      <HiRefresh />
    </ButtonLink>
  ) : null;
}
