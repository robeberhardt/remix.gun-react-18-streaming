import { ActionFunction, json, useActionData, useCatch } from "remix";
import Gun, { GunUser, ISEAPair } from "gun";
import Display from "~/components/DisplayHeading";
import { LoadCtx } from "types";
import FormBuilder from "~/components/FormBuilder";
import React from "react";
import {
  activeTestAccount,
  createTestAccount,
} from "~/lib/stellar/create-pair";
import { loadAccount } from "~/lib/stellar/load-account";
import { Account } from "~/lib/stellar";
import { gun } from "~/server";

type BlogNoSideBar = {
  sectionTitle: {
    heading: string;
  };
  items: {
    title: string;
    author: string;
    postedAt: { date: string; slug: string };
    slug: string;
    image: { src: string };
  }[];
};

export let action: ActionFunction = async ({ params, request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { formData, user } = RemixGunContext(Gun, request);
  let { alias, password, authType } = await formData();
  console.log(alias, password, authType);
  if (typeof alias !== "string") {
    return json({ error: "Invalid alias entry" });
  }
  if (typeof password !== "string") {
    return json({ error: "Invalid password entry" });
  }
  let credentials: {
    userInfo: GunUser;
    sea: ISEAPair;
  };
  try {
    credentials = await user.credentials(alias, password);
  } catch (error) {
    return json({ error });
  }
  let { userInfo, sea } = credentials,
    { alias: _alias, pub } = userInfo;

  let _user = gun.user().auth(sea);
  console.log("user", _user.is.alias);
  let stellarNode = _user.get("stellar_wallet").get("account");
  let stellarData = await stellarNode.then();
  if (!stellarData) {
    const account = await Account.createTestnet();
    stellarNode.put({ pubkey: account.pubkey, secret: account.secret });
    return json({ alias, sea, stellar_wallet: account });
  }
  return json({ alias, sea, stellar_wallet: stellarData });
};
function AuthResponse({ useActionData }: { useActionData: () => any }) {
  let data = useActionData();
  let Logout = FormBuilder();
  if (data && data.error) {
    return (
      <div
        className="w-full mx-auto rounded-xl gap-4  p-4 relative"
        style={{
          minHeight: "320px",
          minWidth: "420px",
          maxWidth: "520px",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          fill="currentColor"
          className="absolute text-red-500 right-2 bottom-3 top-1"
          viewBox="0 0 1792 1792"
        >
          <path d="M1024 1375v-190q0-14-9.5-23.5t-22.5-9.5h-192q-13 0-22.5 9.5t-9.5 23.5v190q0 14 9.5 23.5t22.5 9.5h192q13 0 22.5-9.5t9.5-23.5zm-2-374l18-459q0-12-10-19-13-11-24-11h-220q-11 0-24 11-10 7-10 21l17 457q0 10 10 16.5t24 6.5h185q14 0 23.5-6.5t10.5-16.5zm-14-934l768 1408q35 63-2 126-17 29-46.5 46t-63.5 17h-1536q-34 0-63.5-17t-46.5-46q-37-63-2-126l768-1408q17-31 47-49t65-18 65 18 47 49z" />
        </svg>

        <p className=" text-sm text-red-500 -bottom-6">{data.error}</p>
      </div>
    );
  }
  return (
    data && (
      <div
        className="w-full mx-auto rounded-xl gap-4  p-4 relative"
        style={{
          minHeight: "320px",
          minWidth: "420px",
          maxWidth: "520px",
        }}
      >
        <pre>
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
        <Logout.Form method={"post"}>
          <Logout.Submit label="Logout" />
        </Logout.Form>
      </div>
    )
  );
}

export default function Login() {
  let Login = FormBuilder();
  let [switchFlip, switchSet] = React.useState({
    authType: true,
  });
  return (
    <section className="max-w-screen-xl bg-green-500 dark:bg-gray-800 px-4 py-12 mx-auto sm:py-16 sm:px-6 lg:px-8 lg:py-20">
      <AuthResponse useActionData={useActionData} />
      <div className="overflow-hidden shadow-lg rounded-lg relative mb-1 mb-6 w-64 m-auto">
        <img alt="eggs" src="/images/person/3.jpg" className="rounded-lg" />
        <div className="absolute bg-gradient-to-b bg-opacity-60 from-transparent to-black w-full p-4 bottom-0">
          <p className="text-white text-2xl nb-4">Helena Yakro</p>
          <div className="flex justify-between">
            <p className="text-sm text-gray-300 flex items-center">
              18/12/1993
            </p>
            <p className="text-sm text-gray-300 flex items-center">
              <svg
                width="10"
                height="10"
                fill="currentColor"
                className="h-4 w-4"
                viewBox="0 0 1792 1792"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M491 1536l91-91-235-235-91 91v107h128v128h107zm523-928q0-22-22-22-10 0-17 7l-542 542q-7 7-7 17 0 22 22 22 10 0 17-7l542-542q7-7 7-17zm-54-192l416 416-832 832h-416v-416zm683 96q0 53-37 90l-166 166-416-416 166-165q36-38 90-38 53 0 91 38l235 234q37 39 37 91z" />
              </svg>
              Nantes
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-extrabold leading-9 text-white sm:text-4xl sm:leading-10">
          Used by leading architects, home builders renovators.
        </h2>
        <p className="mt-3 text-base leading-7 sm:mt-4 text-white">
          Feel confident in choosing the best energy assessor for your energy
          rating.
        </p>
      </div>
      <div className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8">
        <div>
          <p className="text-5xl font-extrabold leading-none text-white">119</p>
          <p className="mt-2 text-base font-medium leading-6 text-white">
            Energy raters
          </p>
        </div>
        <div className="mt-10 sm:mt-0">
          <p className="text-5xl font-extrabold leading-none text-white">6</p>
          <p className="mt-2 text-base font-medium leading-6 text-white">
            Quotes on average
          </p>
        </div>
        <div className="mt-10 sm:mt-0">
          <p className="text-5xl font-extrabold leading-none text-white">
            24 hours
          </p>
          <p className="mt-2 text-base font-medium leading-6 text-white">
            Average turnaround
          </p>
        </div>
      </div>
      <div className="w-52 mx-auto mt-4 p-4 flex">
        <button
          type="button"
          className="py-2 px-4  bg-gradient-to-r from-green-400 to-green-400 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 "
        >
          Buy the kit
        </button>
      </div>
      <div
        className="w-full mx-auto rounded-xl gap-4  p-4 relative"
        style={{
          minHeight: "320px",
          minWidth: "420px",
          maxWidth: "650px",
        }}
      >
        <Login.Form method={"post"}>
          <Login.Input type="text" name="alias" label="Alias" />
          <Login.Input type="password" name="password" label="Password" />
          <Login.Submit label={"Authenticate"} />
          <Login.Switch
            name={"authType"}
            value={switchFlip.authType ? "password" : "keypair"}
            state={switchFlip.authType}
            onClick={(state: any) => {
              switchSet({ ...state, authType: !switchFlip.authType });
            }}
            rounded
            label={switchFlip.authType ? "Password" : "Keypair"}
          />
        </Login.Form>
      </div>
    </section>
  );
}

export function CatchBoundary() {
  let caught = useCatch();

  switch (caught.status) {
    case 401:
    case 403:
    case 404:
      return (
        <div className="min-h-screen py-4 flex flex-col justify-center items-center">
          <Display
            title={`${caught.status}`}
            titleColor="white"
            span={`${caught.statusText}`}
            spanColor="pink-500"
            description={`${caught.statusText}`}
          />
        </div>
      );
  }
  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <div className="min-h-screen py-4 flex flex-col justify-center items-center">
      <Display
        title="Error:"
        titleColor="#cb2326"
        span={error.message}
        spanColor="#fff"
        description={`error`}
      />
    </div>
  );
}
