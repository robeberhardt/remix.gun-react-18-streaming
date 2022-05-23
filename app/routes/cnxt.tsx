import { Suspense } from "react";
import Gun from "gun";
import {
  ActionFunction,
  json,
  LoaderFunction,
  useLoaderData,
  useActionData,
  useCatch,
  AppData,
  Link,
  Outlet,
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
import { SectionTitle, Tag } from ".";

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
  let { auth } = RemixGunContext(Gun, request);
  let gun = auth.getMasterUser();
  let data;
  try {
    data = await gun.get("pages").get("cnxt").then();
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

export default function CNXTRoute() {
  let { text, page_title, src } = useLoaderData();
  let img = { src, alt: "RemixGun" };
  return (
    <>
      {/* <BrowserWindow namespace={"https://justtagit.io"} /> */}
      <Link to={"services"}>
        <button
          type="button"
          className="bg-gray-800 py-2 px-4 text-white rounded-lg hover:bg-gray-700 active:bg-gray-600"
        >
          Services
        </button>
      </Link>
      <SectionTitle
        heading={page_title}
        description={text}
        align={"center"}
        color={"primary"}
        showDescription={true}
        image={img}
        node={<Tag color={"gray"} filled={false} label="#JUSTTAGIT" />}
      />
      {/* <DiagonalSection useLoaderData={useLoaderData} /> */}
      <AppWindow />
    </>
  );
}
export function AppWindow() {
  return (
    <div className="p-8 w-full h-full flex items-center justify-center rounded-lg">
      <div className="shadow-lg w-full flex items-start justify-start flex-col  rounded-lg">
        <div className="w-full mx-auto rounded-lg">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
export function DiagonalSection({
  useLoaderData,
}: {
  useLoaderData<T = AppData>(): T;
}) {
  let { text, page_title, src } = useLoaderData();
  let img = { src, alt: "RemixGun" };
  return (
    <div className="py-8 w-full h-full flex items-center justify-center">
      <div className="relative w-full h-64">
        <div className="absolute left-0 top-0 w-full h-full -z-10 transform-gpu -skew-y-6 bg-gradient-to-r from-cnxt_red via-cnxt_blue to-cnxt_navy" />
        <div className="w-full h-full flex flex-col items-center justify-center">
          <span className="text-xl text-white z-10">{page_title}</span>
        </div>
      </div>
    </div>
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
