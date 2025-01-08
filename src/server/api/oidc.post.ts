import {
  discovery,
  randomPKCECodeVerifier,
  calculatePKCECodeChallenge,
  randomNonce,
  buildAuthorizationUrl,
} from 'openid-client';

const validateUrl = (url: string): URL => {
  try {
    const validUrl = new URL(url);
    return validUrl;
  } catch (e) {
    console.error('OIDC server URL is invalid: ', e);
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid OIDC server URL',
    });
  }
};

export default defineEventHandler(async (event) => {
  console.log('oidc event', event);
  const { server, clientId, clientSecret, scope, redirect_uri } =
    useRuntimeConfig();
  if (!server || !clientId || !clientSecret || !redirect_uri) {
    console.error('OIDC configuration missing');
    throw createError({
      statusCode: 400,
      statusMessage: 'OIDC configuration missing',
    });
  }

  const serverUrl = validateUrl(server);

  const config = await discovery(serverUrl, clientId, clientSecret);
  const code_challenge_method = 'S256';
  /**
   * The following (code_verifier and potentially nonce) MUST be generated for
   * every redirect to the authorization_endpoint. You must store the
   * code_verifier and nonce in the end-user session such that it can be recovered
   * as the user gets redirected from the authorization server back to your
   * application.
   */
  const code_verifier = randomPKCECodeVerifier();
  const code_challenge = await calculatePKCECodeChallenge(code_verifier);
  let nonce: string;

  const parameters: Record<string, string> = {
    redirect_uri,
    scope,
    code_challenge,
    code_challenge_method,
  };

  /**
   * We cannot be sure the AS supports PKCE so we're going to use nonce too. Use
   * of PKCE is backwards compatible even if the AS doesn't support it which is
   * why we're using it regardless.
   */
  if (!config.serverMetadata().supportsPKCE()) {
    nonce = randomNonce();
    parameters.nonce = nonce;
  }

  const redirectTo = buildAuthorizationUrl(config, parameters);

  console.log('redirecting to', redirectTo.href);
});
