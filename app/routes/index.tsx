import { Suspense } from "react";
import Gun from "gun";
import {
  ActionFunction,
  json,
  LoaderFunction,
  useLoaderData,
  useActionData,
  useCatch,
} from "remix";
import { useDeferedLoaderData } from "~/dataloader/lib";
import { useIf } from "bresnow_utility-react-hooks";
import { LoadCtx } from "types";
import Display from "~/components/DisplayHeading";
import { useGunStatic } from "~/lib/gun/hooks";
import FormBuilder from "~/components/FormBuilder";
import SimpleSkeleton from "~/components/skeleton/SimpleSkeleton";
import invariant from "@remix-run/react/invariant";
import BrowserWindow from "~/components/Browser";
import React from "react";
import Avatar from "~/components/Avatar";

const noop = () => {};
type ErrObj = {
  path?: string;
  key?: string;
  value?: string;
  form?: string;
};
type LoadError = {
  error: ErrObj;
};
export let loader: LoaderFunction = async ({ params, request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { gun } = RemixGunContext(Gun, request);
  let data;
  try {
    data = await gun.get("pages").get("index").then();
  } catch (error) {
    data = { error };
  }
  return json(data);
};
export let action: ActionFunction = async ({ params, request, context }) => {
  let { RemixGunContext } = context as LoadCtx;
  let { formData } = RemixGunContext(Gun, request);
  let error: ErrObj = {};
  try {
    let { prop, value, path } = await formData();
    console.log(path, prop, value, "prop, value");

    if (!/^(?![0-9])[a-zA-Z0-9$_]+$/.test(prop)) {
      error.key =
        "Invalid property name : Follow Regex Pattern /^(?![0-9])[a-zA-Z0-9$_]+$/";
    }
    if (typeof value !== "string" || value.length < 1 || value.length > 240) {
      error.value =
        "Property values must be greater than 1 and less than 240 characters";
    }

    if (Object.values(error).length > 0) {
      return json<LoadError>({ error });
    }
    return json({ path, data: { [prop]: value } });
  } catch (err) {
    error.form = err as string;
    return json<LoadError>({ error });
  }
};

function WelcomeCard() {
  let { text, page_title, src } = useLoaderData();
  let img = { src, alt: "RemixGun" };
  return (
    <div
      className="w-full mx-auto rounded-xl mt-5 p-5  relative"
      style={{
        minHeight: "320px",
        minWidth: "420px",
      }}
    >
      <SectionTitle
        heading={page_title}
        description={text}
        align={"center"}
        color={"primary"}
        showDescription={true}
        image={img}
      />
      <Card />
    </div>
  );
}

export default function Index() {
  return (
    <>
      <WelcomeCard />
      <BrowserWindow />
      <Tag color={"green"} filled={true} label="Positive Green" />
      <AppWindow />
    </>
  );
}
export function AppWindow() {
  return (
    <div className="p-8 w-full h-full flex items-center justify-center">
      <div className="shadow-lg w-full flex items-start justify-start flex-col border dark:border-gray-800 rounded-lg">
        <div className="w-full flex items-center justify-start relative p-1 border-b dark:border-gray-800">
          <div className="p-1 flex items-center justify-center">
            <div className="bg-red-500 m-1 w-3 h-3 rounded-full" />
            <div className="bg-yellow-500 m-1 w-3 h-3 rounded-full" />
            <div className="bg-green-500 m-1 w-3 h-3 rounded-full" />
          </div>
          <div className="w-full flex items-center justify-center absolute left-0">
            <span className="font-sans text-xs text-gray-500 dark:text-gray-400">
              Hello World
            </span>
          </div>
        </div>
        <div className="">
          <div className="p-4">
            <h1>Hello World</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
export function Card() {
  const [loading, setLoading] = React.useState(true);

  return (
    <div className="p-8 w-full min-h-full flex items-center justify-center">
      <div className="w-full h-auto overflow-hidden shadow-lg flex items-start justify-start flex-col  rounded-lg">
        <div className="w-full flex items-center justify-center border-b dark:border-gray-800 relative">
          <img
            alt="Forest"
            src="https://source.unsplash.com/1200x630/?forest"
            width="1200"
            height="630"
            className={`w-full h-auto transition-opacity duration-200 ${
              loading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={() => {
              setLoading(false);
            }}
          />
          <div className="absolute bg-gradient-to-b bg-opacity-60 from-transparent to-black w-full p-4 bottom-0">
            <div className="flex justify-between">
              <p className="text-sm text-gray-300 flex items-center">
                {/* 18/12/1993 */}
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
                Designed By Bresnow
              </p>
            </div>
          </div>
          {loading && (
            <div className="absolute w-full h-full top-0 left-0 animate-pulse bg-gray-100 dark:bg-gray-900" />
          )}
        </div>
        <div className="p-4 w-full flex items-center justify-start flex-row-reverse">
          <button
            type="button"
            className="bg-gray-800 py-2 px-4 text-white rounded-lg hover:bg-gray-700 active:bg-gray-600"
          >
            Action
          </button>
        </div>
      </div>
    </div>
  );
}
export function Tag({
  color,
  filled,
  label,
}: {
  color: "red" | "yellow" | "green" | "blue" | "gray";
  filled: boolean;
  label: string;
}) {
  return (
    <div className="p-8 w-full h-full flex items-center justify-center flex-col">
      <div className="flex items-center justify-start">
        {filled ? (
          <div
            className={`m-2 border border-${color}-400 dark:border-${color}-500 rounded-full relative bg-${color}-200 dark:bg-${color}-700`}
          >
            <div
              className={`px-2 py-1 text-xs text-${color}-700 dark:text-${color}-200 font-semibold`}
            >
              {label}
            </div>
          </div>
        ) : (
          <div
            className={`m-2 border border-${color}-400 dark:border-${color}-500 rounded-full relative`}
          >
            <div
              className={`px-2 py-1 text-xs text-${color}-700 dark:text-${color}-200 font-semibold`}
            >
              {label}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export const SectionTitle = ({
  heading,
  description,
  align,
  color,
  showDescription,
  image,
  node,
}: TitleProps) => {
  const title = {
    showDescription: showDescription || false,
    align: align ? align : "center",
    color: color ? color : "primary",
  };
  return (
    <section className="max-w-screen-xl rounded-xl bg-primary px-4 py-12 mx-auto sm:py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="overflow-hidden shadow-lg rounded-lg relative  mb-6 w-64 m-auto">
        {/* <Avatar src={image.src} /> */}
        <img alt="eggs" src={image?.src} className="rounded-lg" />
      </div>
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-extrabold leading-20 text-white sm:text-4xl sm:leading-20">
          {heading}
        </h2>
        <p className="mt-3 text-base leading-7 sm:mt-4 text-white">
          {description}
        </p>
      </div>
      {/* <div className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8">
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
      </div> */}
      <div className="w-52 mx-auto mt-4 p-4 flex">
        <button
          type="button"
          disabled
          className="py-2 px-4  bg-gradient-to-r from-green-400 to-green-400 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 "
        >
          Just Tag It
        </button>
      </div>
      <div
        className="w-full mx-auto rounded-xl gap-4  p-4 relative"
        style={{
          minHeight: "320px",
          minWidth: "420px",
          maxWidth: "650px",
        }}
      ></div>
      {node}
    </section>
  );
};
type TitleProps = {
  heading: string;
  description: string;
  align?: "left" | "right" | "center";
  color?: "white" | "primary";
  showDescription: boolean;
  image: { src: string; alt: string };
  node?: React.ReactNode;
};

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
