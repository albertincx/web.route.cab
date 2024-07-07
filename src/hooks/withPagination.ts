import {useEffect, useMemo, useState} from "react";
import {useInView} from "react-intersection-observer";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {fetchAction} from "../api/actions";

const pageSize = 10;

function withPagination<T>(url: any, activeTab?: any) {
    const queryClient = useQueryClient();

    const [page, setPage] = useState<number>(0);
    const [allData, setAllData] = useState<any[]>([]);
    const {ref, inView} = useInView({threshold: 1});
    // const placeholderData = useMemo(() => {
    //     if (page > 2) {
    //         return {
    //             data: [],
    //             pageSize: 10,
    //         }
    //     }
    //     return {
    //         data: [
    //             {name: '1'},
    //             {name: '1'},
    //             {name: '1'},
    //             {name: '1'},
    //             {name: '1'},
    //             {name: '1'},
    //             {name: '1'},
    //             {name: '1'},
    //             {name: '1'},
    //             {name: '1'},
    //         ],
    //         pageSize: 10,
    //     }
    // }, [page])

    useEffect(() => {
        queryClient.clear();
        return () => {
            return queryClient.clear();
        }
    }, [activeTab]);

    const {data: Result, isLoading: loading, error} = useQuery({
        queryKey: [url, activeTab, page],
        queryFn: () => fetchAction(url, {
            query: {page, range: `[${page * pageSize},${pageSize}]`},
            range: 'Content-Range',
        }),
        retry: 1,
        // placeholderData: placeholderData,
    });
    // console.log(Result);
    let data = Array.isArray(Result) ? Result : Result?.data || [];

    // console.log(url, allData, pageSize, data, page);
    const dataLength = data?.length;

    useEffect(() => {
        if (dataLength) {
            setAllData(prevData => {
                return [...prevData, ...data]
            });
        }
    }, [dataLength]);

    useEffect(() => {
        if (inView && !loading && dataLength === pageSize) {
            setPage(prevPage => prevPage + 1);
        }
    }, [inView, loading, dataLength]);

    const resetQuery = () => queryClient.clear();

    return {
        data: allData,
        dataLength,
        loading,
        ref,
        setPage,
        setAllData,
        page,
        error,
        resetQuery
    }
}

export default withPagination;
