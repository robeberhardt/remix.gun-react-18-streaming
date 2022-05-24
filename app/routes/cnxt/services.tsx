import { ActionFunction, json, useActionData, useCatch } from "remix";
import Gun, { GunUser, ISEAPair } from "gun";
import Display from "~/components/DisplayHeading";
import { LoadCtx } from "types";
import FormBuilder from "~/components/FormBuilder";
import React from "react";
import { Account } from "~/lib/stellar";
import { gun } from "~/server";
import jsesc from "jsesc";
import Button from "~/components/Button";
import Avatar from "~/components/Avatar";

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

export default function Login() {
  let Login = FormBuilder();
  let [switchFlip, switchSet] = React.useState({
    authType: true,
  });
  return (
    <section className="max-w-screen-xl bg-green-500 dark:bg-gray-800 px-4 py-12 mx-auto sm:py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="overflow-hidden shadow-lg rounded-lg relative  mb-6 w-64 m-auto">
        <img
          alt="eggs"
          src="/assets/images/placeholder-image.png"
          className="rounded-lg"
        />
        <div className="absolute bg-gradient-to-b bg-opacity-60 from-transparent to-black w-full p-4 bottom-0">
          {/* <p className="text-white text-2xl nb-4">Helena Yakro</p> */}
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
      {/* <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-extrabold leading-9 text-white sm:text-4xl sm:leading-10">
          Used by leading architects, home builders renovators.
        </h2>
        <p className="mt-3 text-base leading-7 sm:mt-4 text-white">
          Feel confident in choosing the best energy assessor for your energy
          rating.
        </p>
      </div> */}
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

      {/* <Login.Form method={"post"}>
        <Login.Input type="text" name="alias" label="Alias" />
        <Login.Input type="password" name="password" label="Password" />
        <Login.Submit label={"Authenticate"} /> */}
      {/* <Login.Switch
          name={"authType"}
          value={switchFlip.authType ? "password" : "keypair"}
          state={switchFlip.authType}
          onClick={(state: any) => {
            switchSet({ ...state, authType: !switchFlip.authType });
          }}
          rounded
          label={switchFlip.authType ? "Password" : "Keypair"}
        /> */}
      {/* </Login.Form> */}
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
