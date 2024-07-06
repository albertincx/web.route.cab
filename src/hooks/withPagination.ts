import {useEffect, useMemo, useState} from "react";
import {useInView} from "react-intersection-observer";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {fetchAction} from "../api/actions";

function withPagination<T>(url: any, activeTab?: any) {
    const queryClient = useQueryClient();

    const [page, setPage] = useState<number>(1);
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
            query: {page},
        }),
        retry: 1,
        // placeholderData: placeholderData,
    });

    let data = Array.isArray(Result) ? Result : Result?.data || [];

    // only achievements
    if (Result?.check_in) {
        data = Result.check_in;
    }
    const pageSize = Result?.pageSize || 0;
    // console.log(url, allData, pageSize, data);

    useEffect(() => {
        if (data) {
            if (Array.isArray(data) && data.length) {
                setAllData(prevData => {
                    return [...prevData, ...data]
                });
            } else if (data.days) {
                // set achievements
                setAllData(data)
            }
        }
    }, [data]);

    useEffect(() => {
        if (inView && !loading && data?.length === pageSize) {
            setPage(prevPage => prevPage + 1);
        }
    }, [inView, loading, data]);

    const resetQuery = () => queryClient.clear();

    return {
        data: allData,
        dataLength: data?.length,
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
